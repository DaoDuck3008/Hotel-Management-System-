import PhongDao from "../DAO/PhongDAO.js";
import db from "../models/index.js";
import { createRoomSchema } from "../validators/PhongValidator.js";
import ExcelJS from "exceljs";

const index = async (req, res) => {
  const roomTypes = await db.LoaiPhong.findAll(); // lấy dữ liệu loại phòng
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

const detail = async (req, res) => {
  const { maPhong } = req.params;

  const room = await PhongDao.getById(maPhong);

  const _room = room ? room.toJSON() : null;

  // console.log(">>> room detail:", _room);

  res.render("Phong/detail.ejs", { room: room });
};

const edit = async (req, res) => {
  const { maPhong } = req.params;

  const roomTypes = await db.LoaiPhong.findAll();
  const amenities = await db.TienIch.findAll();
  const room = await PhongDao.getById(maPhong);

  // const _room = room ? room.toJSON() : null;
  // console.log(">>> room edit:", _room);

  if (!room) {
    req.flash("error", "Phòng không tồn tại!");
    return res.redirect("/rooms");
  }

  return res.render("Phong/edit.ejs", { room, roomTypes, amenities });
};

const update = async (req, res) => {
  try {
    // Kiểm tra phòng tồn tại trước
    const { maPhong } = req.params;
    const room = await PhongDao.getById(maPhong);

    if (!room) {
      req.flash("error", "Phòng không tồn tại!");
      return res.redirect("/rooms");
    }

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
      return res.redirect("/rooms/" + maPhong + "/edit");
    }

    const result = await PhongDao.update(maPhong, req.body, req.files);

    if (!result.success) {
      req.flash("error", "Cập nhật phòng thất bại!");
      return res.redirect("/rooms");
    }

    return res.redirect("/rooms");
  } catch (error) {
    console.error("Error in update PhongController:", error);
    return res.redirect("/rooms");
  }
};

const destroy = async (req, res) => {
  try {
    // console.log(">>> delete room: ", req.params);
    const { maPhong } = req.params;

    const room = await PhongDao.getById(maPhong);

    if (!room) {
      return res
        .status(404)
        .json({ message: "Phòng không tồn tại!", success: false });
    }

    const result = await PhongDao.delete(maPhong);

    if (!result.success) {
      return res
        .status(500)
        .json({ message: "Xóa phòng thất bại!", success: false });
    }

    return res
      .status(200)
      .json({ message: "Xóa phòng thành công!", success: true });
  } catch (error) {
    console.error("Error in delete PhongController:", error);
    return res
      .status(500)
      .json({ message: "Xóa phòng thất bại!", success: false });
  }
};

const search = async (req, res) => {
  const rooms = await PhongDao.search(req.query);
  const roomTypes = await db.LoaiPhong.findAll();

  return res.render("Phong/index.ejs", { rooms, roomTypes });
};

const statistics = async (req, res) => {
  const { typeStats, systemStats } = await PhongDao.statistics();

  // console.log(">>> typeStats:", typeStats);
  // console.log(">>> systemStats:", systemStats);

  return res.render("Phong/statistics.ejs", { typeStats, systemStats });
};

const exportExcel = async (req, res) => {
  try {
    // 1. Lấy dữ liệu thống kê
    const { typeStats, systemStats } = await PhongDao.statistics();

    // 2. Tạo workbook & sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Thong ke phong");

    // 3. Format chung
    sheet.properties.defaultRowHeight = 22;

    // GHI HEADER CHUNG
    sheet.mergeCells("A1", "E1");
    const title = sheet.getCell("A1");
    title.value = "BÁO CÁO THỐNG KÊ PHÒNG";
    title.font = { size: 16, bold: true };
    title.alignment = { horizontal: "center", vertical: "middle" };
    sheet.addRow([]);

    // GHI DỮ LIỆU THEO TỪNG LOẠI PHÒNG
    typeStats.forEach((type, index) => {
      // Tên loại phòng
      sheet.addRow([`Phòng ${type.TenLoaiPhong}`]).font = {
        bold: true,
        size: 14,
      };
      sheet.addRow([
        "STT",
        "Mã phòng",
        "Tên phòng",
        "Giá ngày CB",
        "Giá giờ CB",
        "Sức chứa",
        "Số giường",
      ]).font = { bold: true };

      type.rooms.forEach((r) => {
        sheet.addRow([
          index + 1,
          r.MaPhong,
          r.TenPhong,
          r.GiaNgayCB,
          r.GiaGioCB,
          r.SucChua,
          r.SoGiuong,
        ]);
      });

      // Dòng tóm tắt loại phòng
      sheet.addRow([""]);
      sheet.addRow([
        "",
        `Số phòng: ${type.soLuong}`,
        `Giá TB ngày: ${Number(type.avgGiaNgay)}`,
        `Giá TB giờ: ${Number(type.avgGiaGio)}`,
      ]).font = { italic: true };

      sheet.addRow([""]);
    });

    // THỐNG KÊ TOÀN HỆ THỐNG
    sheet.addRow([""]);
    sheet.addRow(["TỔNG QUAN TOÀN HỆ THỐNG"]).font = { size: 14, bold: true };
    sheet.addRow([""]);
    sheet.addRow([
      `Tổng số phòng: ${systemStats.totalRooms}`,
      `Giá TB ngày: ${Number(systemStats.avgGiaNgaySystem)}`,
      `Giá TB giờ: ${Number(systemStats.avgGiaGioSystem)}`,
      `Tổng giá trị ngày: ${Number(systemStats.totalGiaTriNgay)}`,
    ]);

    const now = new Date();
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const _today = today.toISOString().slice(0, 19).replace("T", " ");

    // Xuất file cho client
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ThongKePhong-${_today}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel error:", error);
    res.status(500).send("Không thể xuất Excel");
  }
};

module.exports = {
  create,
  detail,
  edit,
  update,
  destroy,
  index,
  store,
  search,
  statistics,
  exportExcel,
};
