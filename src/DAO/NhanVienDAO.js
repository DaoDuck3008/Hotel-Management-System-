import db from "../models/index.js";
import { Op, where } from "sequelize";
import uploadBufferToCloudinary from "../utils/uploadBufferToCloudinary.js";

class NhanVienDAO {
  //lấy tất cả nhân viên
  static async getAll() {
    const employees = await db.NhanVien.findAll();
    return employees;
  }

  static async create(data, file) {
    const transaction = await db.sequelize.transaction();
    try {
      // Upload hình ảnh lên Cloudinary nếu có file
      let imgUrl = null;

      if (file) {
        const upload = await uploadBufferToCloudinary(
          file.buffer,
          "hotel/NhanVien"
        );
        imgUrl = upload;
      }

      await db.NhanVien.create(
        {
          MaNV: data.MaNV,
          HoTen: data.HoTen,
          NgayVaoLam: data.NgayVaoLam,
          NgaySinh: data.NgaySinh,
          PhongBan: data.PhongBan,
          SDT: data.SDT,
          Email: data.Email,
          ImgURL: imgUrl || null,
          TrangThai: data.TrangThai,
          Password: data.Password,
          GioiTinh: data.GioiTinh,
        },
        { transaction }
      );

      await transaction.commit();
      return {
        success: true,
        message: "Tạo nhân viên thành công",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating employee in NhanVienDAO:", error);
      throw error;
    }
  }

  // Lấy nhan vien theo mã nhan vien
  static async getById(MaNV) {
    try {
      // Tìm nhan vien cùng các bảng liên quan
      const employee = await db.NhanVien.findOne({
        where: { MaNV: MaNV },
      });
      return employee;
    } catch (error) {
      console.error("Error fetching room by ID in NhanVienDAO:", error);
      throw error;
    }
  }

  // Xoá nhan vien theo mã nhan vien
  static async delete(MaNV) {
    try {
      // Xoá nhan vien
      await db.NhanVien.destroy({
        where: { MaNV: MaNV },
      });

      return {
        success: true,
        message: "Xoá nhan vien thành công",
      };
    } catch (error) {
      console.error("Error deleting room in NhanVienDAO:", error);
      throw error;
    }
  }

  static async update(data, file, MaNV) {
    const transaction = await db.sequelize.transaction();
    try {
      await db.NhanVien.update(
        {
          HoTen: data.HoTen,
          NgayVaoLam: data.NgayVaoLam,
          NgaySinh: data.NgaySinh,
          PhongBan: data.PhongBan,
          SDT: data.SDT,
          Email: data.Email,
          TrangThai: data.TrangThai,
          Password: data.Password,
          GioiTinh: data.GioiTinh,
          DiaChi: data.DiaChi,
        },
        {
          where: {
            MaNV: MaNV,
          },
        },
        { transaction }
      );

      let imgUrl = null;

      if (file) {
        const upload = await uploadBufferToCloudinary(
          file.buffer,
          "hotel/NhanVien"
        );
        imgUrl = upload;
      }

      // Nếu có hình ảnh mới, cập nhật lại trường ImgURL
      if (imgUrl) {
        await db.NhanVien.update(
          {
            ImgURL: imgUrl,
          },
          {
            where: {
              MaNV: MaNV,
            },
          },
          { transaction }
        );
      }
      return {
        success: true,
        message: "Tạo nhân viên thành công",
      };
    } catch (error) {
      console.error("Error updating employee in NhanVienDAO:", error);
      throw error;
    }
  }

  static async search(searchData) {
    try {
      const whereNhanVien = await db.NhanVien.findAll({
        where: {
          [Op.or]: [
            { MaNV: { [Op.like]: `%${searchData}%` } },
            { HoTen: { [Op.like]: `%${searchData}%` } },
          ],
        },
      });
      return whereNhanVien;
    } catch (error) {
      console.log("Error in NhanVienDAO:", error);
      throw error;
    }
  }
}
module.exports = NhanVienDAO;
