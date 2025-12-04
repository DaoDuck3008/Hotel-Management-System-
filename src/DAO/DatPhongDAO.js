import db from "../models/index.js";
import { Op } from "sequelize";
import BookingDetailDTO from "../DTO/DatPhong/BookingDetailDTO";

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

      console.log("Fetched rooms for statistics:", rooms);

      const stats = {
        total: rooms.length,
        empty: 0,
        occupied: 0,
        cleaning: 0,
        booked: 0,
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
          case "Booked":
            stats.booked++;
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
          },
          {
            model: db.ChiTietDatPhong,
            as: "ChiTiet",
            include: [
              {
                model: db.Phong,
                as: "Phong",
                include: [{ model: db.LoaiPhong, as: "LoaiPhong" }],
              },
              {
                model: db.ChiTietGiaDatPhong,
                as: "ChiTietGiaDatPhong",
              },
            ],
          },
        ],
      });

      return new BookingDetailDTO(booking);
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
          },
          {
            model: db.ChiTietDatPhong,
            as: "ChiTiet",
            include: [
              {
                model: db.Phong,
              },
              {
                model: db.ChiTietGiaDatPhong,
                as: "ChiTietGiaDatPhong",
              },
            ],
            order: [["NgayDat", "DESC"]],
          },
        ],
      });
      return bookings;
    } catch (error) {
      console.log("Error fetching all bookings:", error);
      throw error;
    }
  }

  static async createBooking(bookingDTO) {
    const t = await db.sequelize.transaction();
    try {
      const { DatPhong, KhachHang, ChiTiet } = bookingDTO;

      // 1. Tạo khách hàng mới
      const lastCustomer = await db.KhachHang.findOne({
        order: [["MaKhachHang", "DESC"]],
        transaction: t,
      });

      if (!lastCustomer) {
        throw new Error("Không tìm thấy mã khách hàng cuối cùng");
      }

      // Lấy số cuối của mã khách hàng cuối cùng
      const lastMaKhachHang =
        parseInt(lastCustomer?.MaKhachHang?.slice(2)) || 0;
      // tạo mã khách hàng mới
      const newMaKhachHang = `KH${(lastMaKhachHang + 1)
        .toString()
        .padStart(3, "0")}`;

      const { HoVaTen, GioiTinh, NgaySinh, SDT, Email } = KhachHang;
      const newCustomer = await db.KhachHang.create(
        {
          MaKhachHang: newMaKhachHang,
          HoVaTen,
          GioiTinh,
          NgaySinh: NgaySinh || null,
          SDT,
          Email,
        },
        { transaction: t }
      );

      // 2. Tạo đơn đặt phòng
      const now = new Date();
      const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const { NgayNhanPhong, NgayTraPhong } = DatPhong;
      const newBooking = await db.DatPhong.create(
        {
          MaKhachHang: newCustomer.MaKhachHang,
          NgayDat: today,
          NgayNhanPhong,
          NgayTraPhong,
        },
        { transaction: t }
      );

      // 3. Tạo chi tiết đặt phòng
      for (const room of ChiTiet) {
        const datPhongCT = await db.ChiTietDatPhong.create(
          {
            MaDatPhong: newBooking.MaDatPhong,
            MaPhong: room.MaPhong,
          },
          { transaction: t }
        );

        // 4. Tạo chi tiết giá đặt phòng
        for (const priceDetail of room.ChiTietGiaDatPhong) {
          await db.ChiTietGiaDatPhong.create(
            {
              MaCTDatPhong: datPhongCT.MaCTDatPhong,
              Ngay: priceDetail.Ngay,
              GiaNgay: priceDetail.GiaNgay,
              GiaGio: priceDetail.GiaGio,
              LoaiGia: room.LoaiGia,
            },
            { transaction: t }
          );
        }
      }
      for (const room of roomsArray) {
        const now = new Date();
        const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        await db.TrangThaiPhong.create(
          {
            MaPhong: room.MaPhong,
            ThoiGianCapNhat: vietnamTime,
            TrangThai: "Booked",
          },
          { transaction: t }
        );
      }
      await t.commit();

      return { success: true, maDatPhong: newBooking.MaDatPhong };
    } catch (error) {
      await t.rollback();
      console.error("Error creating booking:", error);
      return { success: false, message: error.message };
    }
  }

  static async getAvailableRooms(ngayNhanPhong, ngayTraPhong) {
    const startDatetime = `${ngayNhanPhong} 00:00:00`;
    const endDatetime = `${ngayTraPhong} 23:59:59`;

    // Danh sách phòng bận
    const phongBan = await db.ChiTietDatPhong.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("MaPhong")), "MaPhong"],
      ],
      include: [
        {
          model: db.DatPhong,
          as: "DatPhong",
          required: true,
          where: {
            NgayNhanPhong: { [Op.lte]: endDatetime },
            NgayTraPhong: { [Op.gte]: startDatetime },
          },
        },
      ],
      raw: true,
    });

    const maPhongBan = phongBan.map((p) => p.MaPhong);

    // Lấy tất cả phòng KHÔNG nằm trong danh sách bận
    const rooms = await db.Phong.findAll({
      where: {
        MaPhong: { [Op.notIn]: maPhongBan },
      },
      include: [
        { model: db.LoaiPhong, as: "LoaiPhong" },
        { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
        { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
      ],
      order: [["MaPhong", "ASC"]],
    });

    return rooms;
  }

  static async getNewCustomers() {
    try {
      const customers = await db.KhachHang.findAll({
        attributes: [
          "MaKhachHang",
          "HoVaTen",
          "SDT",
          "Email",
          "GioiTinh",
          "NgaySinh",
        ],
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
      return customers;
    } catch (error) {
      console.error("Error fetching new customers:", error);
      throw error;
    }
  }

  static async getAllCustomers() {
    try {
      return await db.KhachHang.findAll({
        attributes: ["MaKhachHang", "HoVaTen", "SDT", "Email", "GioiTinh"],
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  static async deleteBooking(maDatPhong) {
    try {
      const result = await db.DatPhong.destroy({
        where: { MaDatPhong: maDatPhong },
      });
      if (result) {
        return { success: true, message: "Xóa đơn thành công!" };
      } else {
        return { success: false, message: "Đơn không tồn tại!" };
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { success: false, message: "Xóa thất bại!" };
    }
  }

  //Cập nhật edit vào db
  static async updateBooking(maDatPhong, bookingDTO) {
    const t = await db.sequelize.transaction();
    try {
      const { DatPhong, KhachHang, ChiTiet } = bookingDTO;

      // 1. Lấy thông tin booking cũ
      const booking = await db.DatPhong.findOne({
        where: { MaDatPhong: maDatPhong },
        transaction: t,
      });

      if (!booking) {
        throw new Error("Không tìm thấy đơn đặt phòng");
      }

      // 2. Update khách hàng (không tạo mới)
      const { HoVaTen, GioiTinh, NgaySinh, SDT, Email } = KhachHang;
      await db.KhachHang.update(
        {
          HoVaTen,
          GioiTinh,
          NgaySinh: NgaySinh || null,
          SDT,
          Email,
        },
        {
          where: { MaKhachHang: booking.MaKhachHang },
          transaction: t,
        }
      );

      // 3. Update thông tin đặt phòng
      const { NgayNhanPhong, NgayTraPhong } = DatPhong;
      await db.DatPhong.update(
        {
          NgayNhanPhong,
          NgayTraPhong,
        },
        {
          where: { MaDatPhong: maDatPhong },
          transaction: t,
        }
      );

      // 4. XÓA CHI TIẾT GIÁ + CHI TIẾT ĐẶT PHÒNG CŨ
      const oldCTDP = await db.ChiTietDatPhong.findAll({
        where: { MaDatPhong: maDatPhong },
        transaction: t,
      });

      for (const ct of oldCTDP) {
        // Xóa giá từng ngày
        await db.ChiTietGiaDatPhong.destroy({
          where: { MaCTDatPhong: ct.MaCTDatPhong },
          transaction: t,
        });
      }

      // Xóa chi tiết đặt phòng
      await db.ChiTietDatPhong.destroy({
        where: { MaDatPhong: maDatPhong },
        transaction: t,
      });

      // 5. TẠO LẠI CHI TIẾT ĐẶT PHÒNG + GIÁ THEO NGÀY MỚI
      for (const room of ChiTiet) {
        const newCT = await db.ChiTietDatPhong.create(
          {
            MaDatPhong: maDatPhong,
            MaPhong: room.MaPhong,
          },
          { transaction: t }
        );

        for (const priceDetail of room.ChiTietGiaDatPhong) {
          await db.ChiTietGiaDatPhong.create(
            {
              MaCTDatPhong: newCT.MaCTDatPhong,
              Ngay: priceDetail.Ngay,
              GiaNgay: priceDetail.GiaNgay,
              GiaGio: priceDetail.GiaGio,
              LoaiGia: room.LoaiGia,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();

      return { success: true };
    } catch (error) {
      await t.rollback();
      console.error("Error updating booking:", error);
      return { success: false, message: error.message };
    }
  }

  static async deleteBooking(maDatPhong) {
    try {
      const result = await db.DatPhong.destroy({
        where: { MaDatPhong: maDatPhong },
      });
      if (result) {
        return { success: true, message: "Xóa đơn thành công!" };
      } else {
        return { success: false, message: "Đơn không tồn tại!" };
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { success: false, message: "Xóa thất bại!" };
    }
  }
}

module.exports = DatPhongDAO;
