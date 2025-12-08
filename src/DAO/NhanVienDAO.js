import db from "../models/index.js";
import { Op, where } from "sequelize";
import uploadBufferToCloudinary from "../utils/uploadBufferToCloudinary.js";
import NhanVienDTO from "../DTO/NhanVien/NhanVienDTO.js";

class NhanVienDAO {
  //lấy tất cả nhân viên
  static async getAll() {
    const employees = await db.NhanVien.findAll();
    return employees.map((employee) => new NhanVienDTO(employee));
  }

  static async create(employeeDTO) {
    const transaction = await db.sequelize.transaction();
    try {
      const file = employeeDTO.ImgURL;

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
          MaNV: employeeDTO.MaNV,
          HoTen: employeeDTO.HoTen,
          NgayVaoLam: employeeDTO.NgayVaoLam,
          NgaySinh: employeeDTO.NgaySinh,
          PhongBan: employeeDTO.PhongBan,
          SDT: employeeDTO.SDT,
          Email: employeeDTO.Email,
          ImgURL: imgUrl || null,
          TrangThai: employeeDTO.TrangThai,
          Password: employeeDTO.Password,
          GioiTinh: employeeDTO.GioiTinh,
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
      return new NhanVienDTO(employee);
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

  static async update(employeeDTO, MaNV) {
    const transaction = await db.sequelize.transaction();
    try {
      await db.NhanVien.update(
        {
          HoTen: employeeDTO.HoTen,
          NgayVaoLam: employeeDTO.NgayVaoLam,
          NgaySinh: employeeDTO.NgaySinh,
          PhongBan: employeeDTO.PhongBan,
          SDT: employeeDTO.SDT,
          Email: employeeDTO.Email,
          TrangThai: employeeDTO.TrangThai,
          Password: employeeDTO.Password,
          GioiTinh: employeeDTO.GioiTinh,
          DiaChi: employeeDTO.DiaChi,
        },
        {
          where: {
            MaNV: MaNV,
          },
        },
        { transaction }
      );

      let imgUrl = null;

      const file = employeeDTO.ImgURL;
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
      const { keyword, phongBan, trangThai } = searchData;

      const whereClause = {
        [Op.and]: [],
      };

      // 1. Tìm theo tên hoặc mã NV
      if (keyword && keyword.trim() !== "") {
        whereClause[Op.and].push({
          [Op.or]: [
            { MaNV: { [Op.like]: `%${keyword}%` } },
            { HoTen: { [Op.like]: `%${keyword}%` } },
          ],
        });
      }

      // 2. Lọc theo phòng ban
      if (phongBan && phongBan !== "") {
        whereClause[Op.and].push({ PhongBan: phongBan });
      }

      // 3. Lọc theo trạng thái làm việc
      if (trangThai && trangThai !== "") {
        whereClause[Op.and].push({ TrangThai: trangThai });
      }

      // Nếu không có điều kiện gì → bỏ Op.and để tránh mảng rỗng
      if (whereClause[Op.and].length === 0) {
        delete whereClause[Op.and];
      }

      // Query
      const employees = await db.NhanVien.findAll({
        where: whereClause,
      });

      return employees.map((employee) => new NhanVienDTO(employee));
    } catch (error) {
      console.log("Error in NhanVienDAO:", error);
      throw error;
    }
  }
}
module.exports = NhanVienDAO;
