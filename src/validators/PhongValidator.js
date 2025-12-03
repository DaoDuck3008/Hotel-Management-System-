const Joi = require("joi");

// Kiểm tra điều kiện đầu vào dữ liệu khi tạo phòng
const createRoomSchema = Joi.object({
  MaPhong: Joi.string().min(4).max(4).required(),
  TenPhong: Joi.string().min(3).required(),
  TenLoaiPhong: Joi.string().required(),
  SoGiuong: Joi.number().integer().min(1).required(),
  SucChua: Joi.number().integer().min(1).required(),
  MoTa: Joi.string().allow("").optional(),
  GiaNgayCB: Joi.number().integer().min(0).required(),
  GiaGioCB: Joi.number().integer().min(0).optional().allow(""),

  GiaPhongTuan: Joi.array()
    .items(
      Joi.object({
        ThuApDung: Joi.number().integer().min(2).max(8).required(),
        GiaNgay: Joi.number().integer().min(0).optional().allow(""),
        GiaGio: Joi.number().integer().min(0).optional().allow(""),
      }).optional()
    )
    .sparse()
    .optional(),

  GiaPhongNgayLe: Joi.array()
    .items(
      Joi.object({
        NgayLe: Joi.string().required(),
        NgayBatDau: Joi.date().required(),
        NgayKetThuc: Joi.date().required(),
        GiaNgay: Joi.number().integer().min(0).optional().allow(""),
        GiaGio: Joi.number().integer().min(0).optional().allow(""),
      }).optional()
    )
    .sparse()
    .optional(),

  TienIch: Joi.array().items(Joi.string().regex(/^\d+$/)).required(),

  DeletedImages: Joi.array().items(Joi.string().regex(/^\d+$/)).optional(),
});

module.exports = {
  createRoomSchema,
};
