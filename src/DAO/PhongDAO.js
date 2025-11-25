import db from "../models/index.js";
import cloudinary from "../config/cloudinary.js";

class PhongDAO {
  // Lấy tất cả phòng
  static async getAll() {
    try {
      const rooms = await db.Phong.findAll({
        include: [
          { model: db.LoaiPhong, as: "LoaiPhong" },
          { model: db.TrangThaiPhong, as: "TrangThaiPhong" },
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
}

module.exports = PhongDAO;
