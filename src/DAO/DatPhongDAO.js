import db from "../models/index.js";

class DatPhongDAO {
  // Lấy tất cả phòng với trạng thái hiện tại
  static async getAllRoomsWithStatus() {
    try {
      const rooms = await db.Phong.findAll({
        include: [
          {
            model: db.LoaiPhong,
            as: "LoaiPhong",
          },
          {
            model: db.HinhAnh,
            as: "HinhAnh",
          },
          {
            model: db.GiaPhongTuan,
            as: "GiaPhongTuan",
          },
          {
            model: db.GiaPhongNgayLe,
            as: "GiaPhongNgayLe",
          },
          {
            model: db.TrangThaiPhong,
            as: "TrangThaiPhong",
            separate: true,
            order: [["ThoiGianCapNhat", "DESC"]],
            limit: 1,
          },
        ],
        order: [["MaPhong", "ASC"]],
      });

      return rooms;
    } catch (error) {
      console.error("Error in getAllRoomsWithStatus:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái phòng
  static async updateRoomStatus(maPhong, trangThai) {
    try {
      // Lấy giờ VN hiện tại
      const now = new Date();
      const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      // Kiểm tra phòng tồn tại
      const room = await db.Phong.findOne({
        where: { MaPhong: maPhong },
      });

      if (!room) {
        return {
          success: false,
          message: "Phòng không tồn tại",
        };
      }

      // Tạo bản ghi trạng thái mới
      await db.TrangThaiPhong.create({
        MaPhong: maPhong,
        ThoiGianCapNhat: vietnamTime,
        TrangThai: trangThai,
      });

      return {
        success: true,
        message: "Cập nhật trạng thái phòng thành công",
      };
    } catch (error) {
      console.error("Error updating room status:", error);
      throw error;
    }
  }

  // Lấy thống kê trạng thái phòng
  static async getRoomStatusStatistics() {
    try {
      const rooms = await this.getAllRoomsWithStatus();

      const stats = {
        total: rooms.length,
        empty: 0,
        occupied: 0,
        cleaning: 0,
      };

      rooms.forEach((room) => {
        const status = room.getCurrentTrangThai();
        switch (status) {
          case "Empty":
            stats.empty++;
            break;
          case "Occupied":
            stats.occupied++;
            break;
          case "Cleaning":
            stats.cleaning++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error fetching room statistics:", error);
      throw error;
    }
  }

  // Tạo đơn đặt phòng

  // Lấy chi tiết đơn đặt phòng theo mã
  static async getBookingById(maDatPhong) {
    try {
      const booking = await db.DatPhong.findOne({
        where: { MaDatPhong: maDatPhong },
        include: [
          {
            model: db.KhachHang,
            as: "KhachHang",
            attributes: ["MaKhachHang", "HoVaTen", "SDT", "Email", "GioiTinh"],
          },
          {
            model: db.ChiTietDatPhong,
            include: [
              {
                model: db.Phong,
                include: [{ model: db.LoaiPhong, as: "LoaiPhong" }],
              },
              {
                model: db.ChiTietGiaDatPhong,
              },
            ],
          },
        ],
      });

      return booking;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  }

  static async getAllBookings() {
    try {
      const bookings = await db.DatPhong.findAll({
        include: [
          {
            model: db.KhachHang,
            as: "KhachHang",
            attributes: [
              "MaKhachHang",
              "HoVaTen",
              "SDT",
              "Email",
              "GioiTinh",
              "NgaySinh",
            ],
          },
          {
            model: db.ChiTietDatPhong,
            as: "ChiTiet",
            include: [
              {
                model: db.Phong,

                include: [
                  { model: db.LoaiPhong, as: "LoaiPhong" },
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
            order: [["NgayDat", "DESC"]],
          },
        ],
        attributes: [
          "MaDatPhong",
          "MaKhachHang",
          "NgayDat",
          "NgayNhanPhong",
          "NgayTraPhong",
        ],
      });
      return bookings;
    } catch (error) {
      console.log("Error fetching all bookings:", error);
      throw error;
    }
  }

  static async createBooking(bookingData) {
    const t = await db.sequelize.transaction();
    try {
      // 1. Tạo đơn
      const booking = await db.DatPhong.create(
        {
          MaKhachHang: bookingData.MaKhachHang,
          NgayDat: bookingData.NgayDat,
          NgayNhanPhong: bookingData.NgayNhanPhong,
          NgayTraPhong: bookingData.NgayTraPhong,
        },
        { transaction: t }
      );

      // 2. Tạo chi tiết đặt phòng
      if (bookingData.ChiTiet && bookingData.ChiTiet.length > 0) {
        for (const detail of bookingData.ChiTiet) {
          const chiTiet = await db.ChiTietDatPhong.create(
            {
              MaDatPhong: booking.MaDatPhong,
              MaPhong: detail.MaPhong,
              GiaNgay: detail.GiaNgay || 0,
              GiaGio: detail.GiaGio || 0,
            },
            { transaction: t }
          );

          // 3. Nếu có chi tiết giá theo ngày/ lễ
          if (detail.ChiTietGia && detail.ChiTietGia.length > 0) {
            for (const gia of detail.ChiTietGia) {
              await db.ChiTietGiaDatPhong.create(
                {
                  MaChiTietDatPhong: chiTiet.MaChiTietDatPhong,
                  Ngay: gia.Ngay,
                  GiaNgay: gia.GiaNgay || 0,
                  GiaGio: gia.GiaGio || 0,
                },
                { transaction: t }
              );
            }
          }
        }
      }

      await t.commit();
      return { success: true, booking };
    } catch (error) {
      await t.rollback();
      console.error("Error creating booking:", error);
      return { success: false, message: error.message };
    }
  }

  // Tạo khách hàng mới
  static async createCustomer(customerData) {
    try {
      const newCustomer = await db.KhachHang.create({
        HoVaTen: customerData.HoVaTen,
        SDT: customerData.SDT,
        Email: customerData.Email,
        GioiTinh: customerData.GioiTinh || null,
        NgaySinh: customerData.NgaySinh || null,
        DiaChi: customerData.DiaChi || null,
      });

      return { success: true, customer: newCustomer };
    } catch (error) {
      console.error("Error creating customer:", error);
      return { success: false, message: error.message };
    }
  }

  static async getAvailableRooms() {
    try {
      const rooms = await db.Phong.findAll({
        include: [
          { model: db.LoaiPhong, as: "LoaiPhong" },
          {
            model: db.TrangThaiPhong,
            as: "TrangThaiPhong",
            separate: true,
            order: [["ThoiGianCapNhat", "DESC"]],
            limit: 1,
            where: { TrangThai: "Empty" },
          },
          { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
          { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
        ],
        order: [["MaPhong", "ASC"]],
      });
      return rooms;
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      throw error;
    }
  }
}

module.exports = DatPhongDAO;
