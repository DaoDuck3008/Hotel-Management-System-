const Joi = require("joi");

// Tính tuổi tối thiểu
const MIN_AGE = 16;

const bookingSchema = Joi.object({
  // 🧍 Thông tin khách hàng
  HoVaTen: Joi.string().min(3).required(),
  GioiTinh: Joi.string().valid("Nam", "Nữ", "Khác").required(),
  Email: Joi.string().email().required(),

  SDT: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  // Ngày sinh phải ≥ 16 tuổi
  NgaySinh: Joi.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - MIN_AGE)))
    .required()
    .messages({
      "date.max": `Khách phải đủ ${MIN_AGE} tuổi mới được đặt phòng`,
    }),

  // 📅 Thời gian đặt – Ngày trả > Ngày nhận
  NgayNhanPhong: Joi.date().required(),
  NgayTraPhong: Joi.date()
    .greater(Joi.ref("NgayNhanPhong"))
    .required()
    .messages({
      "date.greater": "Ngày trả phòng phải lớn hơn ngày nhận phòng",
    }),

  // Danh sách phòng
  rooms: Joi.string()
    .custom((value, helpers) => {
      let parsed;

      try {
        parsed = JSON.parse(value);
      } catch (err) {
        return helpers.error("any.invalid");
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return helpers.error("any.invalid", "Danh sách phòng không hợp lệ");
      }

      // Validate từng phòng
      const roomSchema = Joi.object({
        MaPhong: Joi.string().length(4).required(),
        LoaiGia: Joi.string().valid("Giá Ngày", "Giá Giờ").required(),
        ChiTietGiaDatPhong: Joi.array().items(
          Joi.object({
            MaCTGiaDatPhong: Joi.number().optional(),
            Ngay: Joi.string().required(),
            GiaNgay: Joi.number().required(),
            GiaGio: Joi.number().required(),
            LoaiGia: Joi.string().valid("Giá Ngày", "Giá Giờ").optional(),
          })
        ),
      });

      for (const room of parsed) {
        const { error } = roomSchema.validate(room);
        if (error) return helpers.error("any.invalid", error.message);
      }

      return value; // hợp lệ
    })
    .required(),

  MaPhong: Joi.array().items(Joi.string().length(4)).required(),
  LoaiGia: Joi.array()
    .items(Joi.string().valid("Giá Ngày", "Giá Giờ"))
    .required(),
});

module.exports = { bookingSchema };
