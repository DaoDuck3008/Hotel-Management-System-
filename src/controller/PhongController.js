import PhongDao from "../DAO/PhongDAO.js";
import db from "../models/index.js";
import { createRoomSchema } from "../validators/PhongValidator.js";

const index = async (req, res) => {
  const roomTypes = await db.LoaiPhong.findAll();
  const rooms = await PhongDao.getAll();

  return res.render("Phong/index.ejs", { roomTypes, rooms });
};

const create = async (req, res) => {
  const roomTypes = await db.LoaiPhong.findAll();
  const amenities = await db.TienIch.findAll();

  return res.render("Phong/create.ejs", { roomTypes, amenities });
};

const store = async (req, res) => {
  try {
    // console.log(">>> req.body:", req.body);
    // console.log(">>> req.files:", req.files);

    // Gọi validator để kiểm tra dữ liệu đầu vào
    const { error } = createRoomSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    if (error) {
      req.flash(
        "error",
        error.details.map((err) => err.message)
      );
      return res.redirect("/rooms/create");
    }

    const result = await PhongDao.create(req.body, req.files);

    req.flash("success", "Tạo phòng thành công!");
    return res.redirect("/rooms");
  } catch (error) {
    console.error("Error in store roomController:", error);
    return res.redirect("/rooms/create");
  }
};

const detail = (req, res) => {};

const edit = (req, res) => {};

const update = (req, res) => {};

const destroy = (req, res) => {};

module.exports = { create, detail, edit, update, destroy, index, store };
