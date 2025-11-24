const Joi = require("joi");

// Kiểm tra điều kiện đầu vào dữ liệu khi tạo phòng
const createRoomSchema = Joi.object({
  maPhong: Joi.string().min(4).max(4).required(),
  tenPhong: Joi.string().min(3).required(),
  loaiPhong: Joi.string().required(),
  soGiuong: Joi.number().integer().min(1).required(),
  sucChua: Joi.number().integer().min(1).required(),
  moTa: Joi.string().allow("").optional(),
  giaTheoNgay: Joi.number().integer().min(0).required(),
  giaTheoGio: Joi.number().integer().min(0).optional().allow(""),

  giaThu: Joi.array()
    .items(
      Joi.object({
        thu: Joi.number().integer().min(2).max(8).required(),
        giaNgay: Joi.number().integer().min(0).optional().allow(""),
        giaGio: Joi.number().integer().min(0).optional().allow(""),
      }).optional()
    )
    .sparse()
    .optional(),

  giaLe: Joi.array()
    .items(
      Joi.object({
        ten: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        giaNgay: Joi.number().integer().min(0).optional().allow(""),
        giaGio: Joi.number().integer().min(0).optional().allow(""),
      }).optional()
    )
    .sparse()
    .optional(),

  tienIch: Joi.array().items(Joi.string().regex(/^\d+$/)).required(),
});

module.exports = {
  createRoomSchema,
};
