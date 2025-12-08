const Joi = require("joi");

// Kiểm tra điều kiện đầu vào dữ liệu khi tạo nhân viên
const createNhanVienSchema = Joi.object({
  MaNV: Joi.string().min(5).max(6).required(),
  HoTen: Joi.string().min(3).required(),
  NgayVaoLam: Joi.date().required(),
  NgaySinh: Joi.date().max("2007-01-01").less(Joi.ref("NgayVaoLam")).required(),
  PhongBan: Joi.string()
    .valid("Phong", "NhanSu", "KinhDoanh", "LeTan", "Admin")
    .optional()
    .allow(""),
  SDT: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow(""),
  Email: Joi.string().email().required(),
  TrangThai: Joi.string()
    .valid("Đang tạm nghỉ", "Đang làm việc")
    .optional()
    .allow(""),
  GioiTinh: Joi.string().valid("Nam", "Nữ", "Khác").optional().allow(""),
  DiaChi: Joi.string().min(5).optional().allow(""),
  Password: Joi.string().min(6).required(),
  ImgURL: Joi.string().optional().allow(""),
});

module.exports = { createNhanVienSchema };
