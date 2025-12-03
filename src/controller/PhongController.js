import PhongDao from "../DAO/PhongDAO.js";
import db from "../models/index.js";
import { createRoomSchema } from "../validators/PhongValidator.js";
import ExcelJS from "exceljs";
import RoomDetailDTO from "../DTO/Phong/RoomDetailDTO.js";

// Hiển thị danh sách phòng
const index = async (req, res) => {
  const roomTypes = await db.LoaiPhong.findAll(); // lấy dữ liệu loại phòng phục vụ tìm kiếm
  const rooms = await PhongDao.getAll(); // lấy dữ liệu phòng từ PhongDao

  return res.render("Phong/index.ejs", { roomTypes, rooms });
};

// Mở form tạo phòng mới
const create = async (req, res) => {
  const roomTypes = await db.LoaiPhong.findAll(); // lấy dữ liệu loại phòng
  const amenities = await db.TienIch.findAll(); // lấy dữ liệu tiện ích

  return res.render("Phong/create.ejs", { roomTypes, amenities });
};

// Lưu phòng mới
const store = async (req, res) => {
  try {
    // Gọi validator để kiểm tra dữ liệu đầu vào
    const { error } = createRoomSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    // Nếu dữ liệu không hợp lệ, thì trả về lỗi
    if (error) {
      req.flash(
        "error",
        error.details.map((err) => err.message)
      );
      return res.redirect("/rooms/create");
    }

    // tạo đối tượng phòng mới và lưu các trường thông tin
    let roomDTO = new RoomDetailDTO(req.body);
    roomDTO.TienIch = req.body.TienIch;
    roomDTO.HinhAnh = req.files;

    const result = await PhongDao.create(roomDTO); // gọi DAO để tạo phòng mới

    // Kiểm tra kết quả trả về từ DAO
    if (!result.success) {
      req.flash("error", "Tạo phòng thất bại!");
      return res.redirect("/rooms/create");
    }

    req.flash("success", "Tạo phòng thành công!");
    return res.redirect("/rooms");
  } catch (error) {
    console.error("Error in store roomController:", error);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/rooms/create");
  }
};

// Xem chi tiết phòng
const detail = async (req, res) => {
  const { maPhong } = req.params; // Lấy mã phòng từ tham số URL

  const room = await PhongDao.getById(maPhong); // Lấy dữ liệu phòng từ DAO

  res.render("Phong/detail.ejs", { room: room });
};

// Mở form chỉnh sửa phòng
const edit = async (req, res) => {
  const { maPhong } = req.params; // Lấy mã phòng từ tham số URL

  const roomTypes = await db.LoaiPhong.findAll(); // Lấy dữ liệu loại phòng
  const amenities = await db.TienIch.findAll(); // Lấy dữ liệu tiện ích
  const room = await PhongDao.getById(maPhong); // Lấy dữ liệu phòng từ DAO

  // Kiểm tra phòng tồn tại
  if (!room) {
    req.flash("error", "Phòng không tồn tại!");
    return res.redirect("/rooms");
  }

  return res.render("Phong/edit.ejs", { room, roomTypes, amenities });
};

// Chỉnh sửa phòng
const update = async (req, res) => {
  try {
    // Gọi validator để kiểm tra dữ liệu đầu vào
    const { error } = createRoomSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    // Nếu dữ liệu không hợp lệ, thì trả về lỗi
    if (error) {
      req.flash(
        "error",
        error.details.map((err) => err.message)
      );
      return res.redirect("/rooms/" + maPhong + "/edit");
    }

    // Tạo đối tượng
    let updatedRoomDTO = new RoomDetailDTO(req.body);
    updatedRoomDTO.TienIch = req.body.TienIch;
    updatedRoomDTO.HinhAnh = req.files;
    const deletedImages = req.body.DeletedImages;

    const result = await PhongDao.update(updatedRoomDTO, deletedImages); // Gọi DAO để cập nhật phòng

    // Kiểm tra kết quả trả về từ DAO
    if (!result.success) {
      req.flash("error", "Cập nhật phòng thất bại!");
      return res.redirect("/rooms");
    }

    req.flash("success", "Cập nhật thành công!");
    return res.redirect("/rooms");
  } catch (error) {
    console.error("Error in update PhongController:", error);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/rooms");
  }
};

// Xóa phòng
const destroy = async (req, res) => {
  try {
    const { maPhong } = req.params; // Lấy mã phòng từ tham số URL

    const room = await PhongDao.getById(maPhong); // Kiểm tra phòng tồn tại

    // Nếu phòng không tồn tại, trả về thông báo lỗi
    if (!room) {
      return res
        .status(404)
        .json({ message: "Phòng không tồn tại!", success: false });
    }

    const result = await PhongDao.delete(maPhong); // Gọi DAO để xóa phòng

    // Kiểm tra kết quả trả về từ DAO
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

// Tìm kiếm
const search = async (req, res) => {
  const rooms = await PhongDao.search(req.query); // Lấy dữ liệu phòng theo điều kiện tìm kiếm
  const roomTypes = await db.LoaiPhong.findAll(); // lấy dữ liệu loại phòng phục vụ tìm kiếm

  return res.render("Phong/index.ejs", { rooms, roomTypes });
};

// Thống kê
const statistics = async (req, res) => {
  const { typeStats, systemStats } = await PhongDao.statistics(); // Lấy dữ liệu thống kê

  return res.render("Phong/statistics.ejs", { typeStats, systemStats });
};

// Xuất file excel
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
