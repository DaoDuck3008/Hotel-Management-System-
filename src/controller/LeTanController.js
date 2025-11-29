import DatPhongDAO from "../DAO/DatPhongDAO.js";

// Trang chính - hiển thị danh sách phòng và trạng thái
const index = async (req, res) => {
  try {
    const rooms = await DatPhongDAO.getAllRoomsWithStatus();
    const stats = await DatPhongDAO.getRoomStatusStatistics();

    return res.render("LeTan/index.ejs", { rooms, stats });
  } catch (error) {
    console.error("Error in receptions index:", error);
    req.flash("error", "Có lỗi xảy ra khi tải dữ liệu");
    return res.redirect("/");
  }
};

// Cập nhật trạng thái phòng
const updateStatus = async (req, res) => {
  try {
    const { maPhong } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Empty", "Occupied", "Cleaning", "Booked"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const result = await DatPhongDAO.updateRoomStatus(maPhong, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating room status:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật trạng thái",
    });
  }
};

// Danh sách đơn đặt phòng cần thanh toán
const paymentList = async (req, res) => {
  try {
    const db = require("../models/index.js");

    // Lấy đơn: có phòng Occupied và chưa thanh toán
    const bookings = await db.DatPhong.findAll({
      where: {
        TrangThaiThanhToan: "ChuaThanhToan",
      },
      include: [
        {
          model: db.KhachHang,
          as: "KhachHang",
          attributes: ["MaKhachHang", "HoVaTen", "SDT", "Email"],
        },
        {
          model: db.ChiTietDatPhong,
          as: "ChiTiet",
          include: [
            {
              model: db.Phong,
              include: [
                { model: db.LoaiPhong, as: "LoaiPhong" },
                { model: db.HinhAnh, as: "HinhAnh", limit: 1 },
                {
                  model: db.TrangThaiPhong,
                  as: "TrangThaiPhong",
                  separate: true,
                  order: [["ThoiGianCapNhat", "DESC"]],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
      order: [["NgayDat", "DESC"]],
    });

    // Lọc chỉ hiển thị đơn có ít nhất 1 phòng Occupied
    const unpaidBookings = bookings.filter((booking) => {
      return booking.ChiTiet?.some((detail) => {
        const currentStatus = detail.Phong?.TrangThaiPhong?.[0]?.TrangThai;
        return currentStatus === "Occupied";
      });
    });

    return res.render("LeTan/payment-list.ejs", {
      bookings: unpaidBookings,
    });
  } catch (error) {
    console.error("Error in payment list:", error);
    req.flash("error", "Có lỗi xảy ra khi tải dữ liệu");
    return res.redirect("/receptions");
  }
};

// Chi tiết thanh toán
const paymentDetail = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    // Lấy thông tin đặt phòng
    const db = require("../models/index.js");
    const PhongDao = require("../DAO/PhongDAO.js");

    const booking = await db.DatPhong.findOne({
      where: { MaDatPhong: maDatPhong },
      include: [
        {
          model: db.KhachHang,
          as: "KhachHang",
          attributes: ["MaKhachHang", "HoVaTen", "SDT", "Email"],
        },
        {
          model: db.ChiTietDatPhong,
          as: "ChiTiet",
          include: [
            {
              model: db.Phong,
              include: [
                { model: db.LoaiPhong, as: "LoaiPhong" },
                { model: db.HinhAnh, as: "HinhAnh", limit: 1 },
                { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
                { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
              ],
            },
          ],
        },
      ],
    });

    if (!booking) {
      req.flash("error", "Không tìm thấy thông tin đặt phòng");
      return res.redirect("/receptions/payment");
    }

    // Kiểm tra xem đơn đã thanh toán chưa
    if (booking.TrangThaiThanhToan === "DaThanhToan") {
      req.flash("error", "Đơn đặt phòng này đã được thanh toán");
      return res.redirect("/receptions/payment");
    }

    // Tính tiền cho TẤT CẢ phòng trong đơn
    const checkIn = new Date(booking.NgayNhanPhong);
    const checkOut = new Date(booking.NgayTraPhong);
    const totalHours = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60));
    const totalDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    let allRoomsDetails = []; // Chi tiết từng phòng
    let grandSubtotal = 0;

    // Duyệt qua từng phòng
    for (const detail of booking.ChiTiet) {
      const room = detail.Phong;
      let roomSubtotal = 0;
      let priceDetails = [];
      let bookingType = "day";
      let isHourly = false;

      // Kiểm tra thuê theo giờ hay ngày
      if (totalHours <= 6) {
        const checkInDate = new Date(booking.NgayNhanPhong);
        const dayOfWeek = checkInDate.getDay();

        const weekdayPrice = room.GiaPhongTuan?.find(
          (g) => g.ThuApDung === dayOfWeek
        );
        const holidayPrice = room.GiaPhongNgayLe?.find((h) => {
          const start = new Date(h.NgayBatDau);
          const end = h.NgayKetThuc ? new Date(h.NgayKetThuc) : start;
          return checkInDate >= start && checkInDate <= end;
        });

        const hourlyRate =
          holidayPrice?.GiaGio || weekdayPrice?.GiaGio || room.GiaGioCB;

        if (hourlyRate) {
          isHourly = true;
          bookingType = "hour";
        }
      }

      if (isHourly) {
        // Tính theo giờ
        const checkInDate = new Date(booking.NgayNhanPhong);
        const dayOfWeek = checkInDate.getDay();

        const weekdayPrice = room.GiaPhongTuan?.find(
          (g) => g.ThuApDung === dayOfWeek
        );
        const holidayPrice = room.GiaPhongNgayLe?.find((h) => {
          const start = new Date(h.NgayBatDau);
          const end = h.NgayKetThuc ? new Date(h.NgayKetThuc) : start;
          return checkInDate >= start && checkInDate <= end;
        });

        const hourlyRate =
          holidayPrice?.GiaGio || weekdayPrice?.GiaGio || room.GiaGioCB;
        roomSubtotal = hourlyRate * totalHours;

        priceDetails.push({
          description: `${totalHours} giờ`,
          price: hourlyRate,
          quantity: totalHours,
          total: roomSubtotal,
          type: holidayPrice
            ? `Ngày lễ: ${holidayPrice.NgayLe}`
            : `Thứ ${dayOfWeek === 0 ? "CN" : dayOfWeek + 1}`,
        });
      } else {
        // Tính theo ngày
        let currentDate = new Date(checkIn);

        for (let i = 0; i < totalDays; i++) {
          const dayOfWeek = currentDate.getDay();

          const holidayPrice = room.GiaPhongNgayLe?.find((h) => {
            const start = new Date(h.NgayBatDau);
            const end = h.NgayKetThuc ? new Date(h.NgayKetThuc) : start;
            return currentDate >= start && currentDate <= end;
          });

          const weekdayPrice = room.GiaPhongTuan?.find(
            (g) => g.ThuApDung === dayOfWeek
          );
          const dailyRate =
            holidayPrice?.GiaNgay || weekdayPrice?.GiaNgay || room.GiaNgayCB;

          roomSubtotal += dailyRate;

          priceDetails.push({
            date: new Date(currentDate).toLocaleDateString("vi-VN"),
            description: holidayPrice
              ? `Ngày lễ: ${holidayPrice.NgayLe}`
              : `Thứ ${dayOfWeek === 0 ? "CN" : dayOfWeek + 1}`,
            price: dailyRate,
            quantity: 1,
            total: dailyRate,
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      allRoomsDetails.push({
        room: room,
        bookingType: bookingType,
        priceDetails: priceDetails,
        subtotal: roomSubtotal,
      });

      grandSubtotal += roomSubtotal;
    }

    const vat = grandSubtotal * 0.1;
    const total = grandSubtotal + vat;

    return res.render("LeTan/payment-detail.ejs", {
      booking,
      allRoomsDetails,
      totalDays,
      totalHours,
      subtotal: grandSubtotal,
      vat,
      total,
    });
  } catch (error) {
    console.error("Error in payment detail:", error);
    req.flash("error", "Có lỗi xảy ra khi tải thông tin thanh toán");
    return res.redirect("/receptions/payment");
  }
};

// Xử lý thanh toán
const processPayment = async (req, res) => {
  try {
    const { maDatPhong } = req.params;
    const db = require("../models/index.js");

    // Lấy tất cả phòng trong đơn
    const booking = await db.DatPhong.findOne({
      where: { MaDatPhong: maDatPhong },
      include: [
        {
          model: db.ChiTietDatPhong,
          attributes: ["MaPhong"],
          as: "ChiTiet",
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt phòng",
      });
    }

    // Cập nhật trạng thái tất cả phòng về Cleaning
    for (const detail of booking.ChiTiet) {
      await DatPhongDAO.updateRoomStatus(detail.MaPhong, "Cleaning");
    }

    // CẬP NHẬT TRẠNG THÁI THANH TOÁN
    await db.DatPhong.update(
      { TrangThaiThanhToan: "DaThanhToan" },
      { where: { MaDatPhong: maDatPhong } }
    );

    return res.status(200).json({
      success: true,
      message: "Thanh toán thành công!",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xử lý thanh toán",
    });
  }
};

module.exports = {
  index,
  updateStatus,
  paymentList,
  paymentDetail,
  processPayment,
};
