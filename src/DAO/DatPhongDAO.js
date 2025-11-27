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
}

module.exports = DatPhongDAO;
