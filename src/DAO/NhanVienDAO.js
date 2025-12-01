import db from "../models/index.js";
import cloudinary from "../config/cloudinary.js";
import { Op, where } from "sequelize";

class NhanVienDAO {
  static async getAll() {
    const employees = await db.NhanVien.findAll();
    return employees;
  }

  static async create(data) {
    const transaction = await db.sequelize.transaction();
    try {
      const newEmployee = await db.NhanVien.create({
        MaNV: data.MaNV,
        HoTen: data.HoTen,
        NgayVaoLam: data.NgayVaoLam,
        NgaySinh: data.NgaySinh,
        PhongBan: data.PhongBan,
        SDT: data.SDT,
        Email: data.Email,
        ImgURL: data.image,
        TrangThai: data.TrangThai,
        Password: data.Password,
        GioiTinh: data.GioiTinh,
      });

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

  static async update(data, MaNV) {
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
      },
      {
        where: {
          MaNV: MaNV,
        },
      }
    );
    return {
      success: true,
      message: "Tạo nhân viên thành công",
    };
  }
}
module.exports = NhanVienDAO;
