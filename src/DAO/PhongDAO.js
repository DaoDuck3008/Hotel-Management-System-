import db from "../models/index.js";
import cloudinary from "../config/cloudinary.js";
import { Op, where } from "sequelize";

class PhongDAO {
  // Lấy tất cả phòng
  static async getAll() {
    try {
      const rooms = await db.Phong.findAll({
        include: [
          { model: db.LoaiPhong, as: "LoaiPhong" },
          { model: db.TrangThaiPhong, as: "TrangThaiPhong" },
          { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
          { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
          { model: db.HinhAnh, as: "HinhAnh" },
        ],
      });
      return rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  }

  // Tạo phòng mới
  static async create(data, files) {
    const transaction = await db.sequelize.transaction();
    try {
      // console.log(">>> PhongDAO.create data:", data);
      // console.log(">>> PhongDAO.create files:", files);

      // lưu phòng mới
      const newRoom = await db.Phong.create(
        {
          MaPhong: data.maPhong,
          TenPhong: data.tenPhong,
          TenLoaiPhong: data.loaiPhong,
          SoGiuong: data.soGiuong,
          SucChua: data.sucChua,
          MoTa: data.moTa,
          GiaNgayCB: data.giaTheoNgay,
          GiaGioCB: data.giaTheoGio || null,
        },
        { transaction }
      );

      // Lấy giờ ở VN hiện tại
      const now = new Date();
      const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      // lưu trạng thái phòng là "Trống"
      await db.TrangThaiPhong.create(
        {
          MaPhong: data.maPhong,
          ThoiGianCapNhat: vietnamTime,
          TrangThai: "Empty",
        },
        { transaction }
      );

      // lưu tiện ích phòng
      if (data.tienIch && data.tienIch.length > 0) {
        const tienIch = data.tienIch || [];
        tienIch.forEach(async (maTienIch) => {
          await db.Phong_TienIch.create(
            {
              MaPhong: data.maPhong,
              MaTienIch: maTienIch,
            },
            { transaction }
          );
        });
      }

      // lưu giá theo thứ trong tuần
      if (data.giaThu && data.giaThu.length > 0) {
        for (const item of data.giaThu) {
          if (!item || !item.thu) continue;

          await db.GiaPhongTuan.create(
            {
              MaPhong: data.maPhong,
              ThuApDung: item.thu,
              GiaNgay: item.giaNgay || null,
              GiaGio: item.giaGio || null,
            },
            { transaction }
          );
        }
      }

      // lưu giá theo ngày lễ
      if (data.giaLe && data.giaLe.length > 0) {
        for (const item of data.giaLe) {
          if (!item || !item.ten) continue;

          await db.GiaPhongNgayLe.create(
            {
              MaPhong: data.maPhong,
              NgayLe: item.ten,
              NgayBatDau: item.start,
              NgayKetThuc: item.end || null,
              GiaNgay: item.giaNgay || null,
              GiaGio: item.giaGio || null,
            },
            { transaction }
          );
        }
      }

      // upload hình ảnh phòng lên cloudinary
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "hotel/phong",
                  public_id: `${newRoom.MaPhong}_${Date.now()}`,
                },
                async (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          });
        });

        const imageUrls = await Promise.all(uploadPromises);
        console.log(">>> Uploaded image URLs:", imageUrls);

        // lưu hình ảnh vào bảng HinhAnh
        await db.HinhAnh.bulkCreate(
          imageUrls.map((url) => ({
            MaPhong: data.maPhong,
            ImgURL: url,
          })),
          { transaction }
        );
      }

      await transaction.commit();
      return {
        success: true,
        message: "Tạo phòng thành công",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating room in PhongDAO:", error);
      throw error;
    }
  }

  // Lấy phòng theo mã phòng
  static async getById(maPhong) {
    try {
      const room = await db.Phong.findOne({
        where: { MaPhong: maPhong },
        include: [
          { model: db.LoaiPhong, as: "LoaiPhong" },
          { model: db.TrangThaiPhong, as: "TrangThaiPhong" },
          { model: db.HinhAnh, as: "HinhAnh" },
          { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
          { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
          {
            model: db.TienIch,
            as: "TienIch",
            through: { attributes: [] },
          },
        ],
      });
      return room;
    } catch (error) {
      console.error("Error fetching room by ID in PhongDAO:", error);
      throw error;
    }
  }

  // Xoá phòng theo mã phòng
  static async delete(maPhong) {
    try {
      await db.Phong.destroy({
        where: { MaPhong: maPhong },
      });

      return {
        success: true,
        message: "Xoá phòng thành công",
      };
    } catch (error) {
      console.error("Error deleting room in PhongDAO:", error);
      throw error;
    }
  }

  // Cập nhật phòng
  static async update(maPhong, data, files) {
    const transaction = await db.sequelize.transaction();
    try {
      // Cập nhật thông tin phòng
      await db.Phong.update(
        {
          TenPhong: data.tenPhong,
          TenLoaiPhong: data.loaiPhong,
          SoGiuong: data.soGiuong,
          SucChua: data.sucChua,
          MoTa: data.moTa,
          GiaNgayCB: data.giaTheoNgay,
          GiaGioCB: data.giaTheoGio || null,
        },
        { where: { MaPhong: maPhong }, transaction }
      );

      // Cập nhật tiện ích phòng
      if (data.tienIch && data.tienIch.length > 0) {
        // Xoá hết tiện ích cũ
        await db.Phong_TienIch.destroy({
          where: { MaPhong: maPhong },
          transaction,
        });

        // Thêm lại tiện ích mới
        const tienIch = data.tienIch || [];
        tienIch.forEach(async (maTienIch) => {
          await db.Phong_TienIch.create(
            {
              MaPhong: data.maPhong,
              MaTienIch: maTienIch,
            },
            { transaction }
          );
        });
      }

      // Cập nhật giá tuần
      if (data.giaThu && data.giaThu.length > 0) {
        for (const item of data.giaThu) {
          if (!item || !item.thu) continue;

          await db.GiaPhongTuan.update(
            {
              GiaNgay: item.giaNgay || null,
              GiaGio: item.giaGio || null,
            },
            {
              where: {
                MaPhong: maPhong,
                ThuApDung: item.thu,
              },
              transaction,
            }
          );
        }
      }

      // Cập nhật giá ngày lễ
      if (data.giaLe && data.giaLe.length > 0) {
        for (const item of data.giaLe) {
          if (!item || !item.ten) continue;

          await db.GiaPhongNgayLe.update(
            {
              NgayBatDau: item.start,
              NgayKetThuc: item.end || null,
              GiaNgay: item.giaNgay || null,
              GiaGio: item.giaGio || null,
            },
            {
              where: {
                MaPhong: maPhong,
                NgayLe: item.ten,
              },
              transaction,
            }
          );
        }
      }

      // Xóa hình ảnh đã chọn
      if (data.deletedImages && data.deletedImages.length > 0) {
        await db.HinhAnh.destroy({
          where: {
            MaHinhAnh: data.deletedImages,
          },
          transaction,
        });
      }

      // Nếu có file mới được tải lên
      if (files && files.length > 0) {
        // upload hình ảnh phòng lên cloudinary
        const uploadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "hotel/phong",
                  public_id: `${maPhong}_${Date.now()}`,
                },
                async (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          });
        });

        const imageUrls = await Promise.all(uploadPromises);

        // lưu hình ảnh vào bảng HinhAnh
        await db.HinhAnh.bulkCreate(
          imageUrls.map((url) => ({
            MaPhong: maPhong,
            ImgURL: url,
          })),
          { transaction }
        );
      }

      await transaction.commit();
      return {
        success: true,
        message: "Cập nhật phòng thành công",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating room in PhongDAO:", error);
      throw error;
    }
  }

  // Tìm kiếm phòng
  static async search(searchData) {
    try {
      const wherePhong = {};
      const include = [];

      // 1. Tìm kiếm theo keyword
      if (searchData.keyword) {
        wherePhong[Op.or] = [
          { TenPhong: { [Op.like]: `%${searchData.keyword}%` } },
          { MaPhong: { [Op.like]: `%${searchData.keyword}%` } },
        ];
      }

      // 2. Tìm theo sức chứa tối thiểu
      if (searchData.sucChua) {
        wherePhong.SucChua = { [Op.gte]: searchData.sucChua };
      }

      // 3. Tìm theo loại phòng
      if (searchData.loaiPhong) {
        wherePhong.TenLoaiPhong = searchData.loaiPhong;
      }

      // 4. Tìm theo giá
      if (searchData.giaTu || searchData.giaDen) {
        include.push({
          model: db.GiaPhongTuan,
          as: "GiaPhongTuan",
          required: true,
          where: {
            GiaNgay: {
              [Op.between]: [
                parseInt(searchData.giaTu) || 0,
                parseInt(searchData.giaDen) || Number.MAX_SAFE_INTEGER,
              ],
            },
          },
        });
      }

      // 5. Bao gồm các bảng khác
      include.push(
        { model: db.HinhAnh, as: "HinhAnh" },
        { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
        { model: db.TrangThaiPhong, as: "TrangThaiPhong" },
        { model: db.LoaiPhong, as: "LoaiPhong" },
        { model: db.GiaPhongTuan, as: "GiaPhongTuan" }
      );

      // 6. Query chính
      const rooms = await db.Phong.findAll({
        where: wherePhong,
        include,
      });

      return rooms;
    } catch (error) {
      console.error("Error searching rooms in PhongDAO:", error);
      throw error;
    }
  }

  // Thống kê phòng
  static async statistics() {
    try {
      const { fn, col } = db.sequelize;

      // 1) SQL xử lý thống kê theo loại phòng
      const typeStats = await db.Phong.findAll({
        attributes: [
          "TenLoaiPhong",
          [fn("COUNT", col("MaPhong")), "soLuong"],
          [fn("AVG", col("GiaNgayCB")), "avgGiaNgay"],
          [fn("AVG", col("GiaGioCB")), "avgGiaGio"],
        ],
        group: ["TenLoaiPhong"],
        raw: true,
      });

      // 2) Lấy toàn bộ danh sách phòng
      const rooms = await db.Phong.findAll({
        attributes: [
          "MaPhong",
          "TenPhong",
          "TenLoaiPhong",
          "GiaNgayCB",
          "GiaGioCB",
          "SucChua",
          "SoGiuong",
        ],
        raw: true,
      });

      // 3) Gộp phòng vào từng loại trong typeStats
      const typeStatsWithRooms = typeStats.map((type) => {
        return {
          ...type,
          rooms: rooms.filter((r) => r.TenLoaiPhong === type.TenLoaiPhong),
        };
      });

      // 4) Thống kê toàn hệ thống
      const systemStats = await db.Phong.findOne({
        attributes: [
          [fn("COUNT", col("MaPhong")), "totalRooms"],
          [fn("AVG", col("GiaNgayCB")), "avgGiaNgaySystem"],
          [fn("AVG", col("GiaGioCB")), "avgGiaGioSystem"],
          [fn("SUM", col("GiaNgayCB")), "totalGiaTriNgay"],
        ],
        raw: true,
      });

      return {
        typeStats: typeStatsWithRooms,
        systemStats,
      };
    } catch (error) {
      console.error("Error in PhongDAO.statistics:", error);
      throw error;
    }
  }

  static async getPriceRange(maPhong, ngayNhan, ngayTra) {
    try {
      // Chuyển input thành ngày VN
      let start = getVietnamDate(ngayNhan);
      let end = getVietnamDate(ngayTra);

      // Fix giờ về 00:00:00 để tránh lệch ngày
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Lấy phòng cùng các bảng giá liên quan
      const phong = await db.Phong.findOne({
        where: { MaPhong: maPhong },
        include: [
          { model: db.GiaPhongNgayLe, as: "GiaPhongNgayLe" },
          { model: db.GiaPhongTuan, as: "GiaPhongTuan" },
        ],
      });

      // nếu không có phòng thì trả về mảng rỗng
      if (!phong) {
        console.log(">>> Không tìm thấy phòng trong PhongDAO.getPriceRange");
        return [];
      }

      let prices = [];
      let current = new Date(start);

      while (current <= end) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, "0");
        const dd = String(current.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`; // format chuẩn YYYY-MM-DD

        // Hàm lấy giá theo ngày bạn đã có trong model
        const giaNgay = phong.getGiaNgayToday();
        const giaGio = phong.getGiaGioToday();

        prices.push({
          date: dateStr,
          giaNgay,
          giaGio,
        });

        // Chuyển sang ngày tiếp theo
        current.setDate(current.getDate() + 1);
      }

      return prices;
    } catch (error) {
      console.error("Error in PhongDAO.getPriceRange:", error);
      throw error;
    }
  }
}

function getVietnamDate(dateInput = new Date()) {
  return new Date(
    new Date(dateInput).toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );
}

module.exports = PhongDAO;
