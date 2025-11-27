import express from "express";
import PhongController from "../controller/PhongController.js";
import LeTanController from "../controller/LeTanController.js";
import upload from "../middlewares/upload.js";
import DatPhongController from "../controller/DatPhongController.js";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello World!");
  });

  //  ===== Phong routes =====
  router.get("/rooms", PhongController.index); // Lấy danh sách phòng
  router.get("/rooms/statistics", PhongController.statistics); // Thống kê phòng
  router.get("/rooms/statistics/export", PhongController.exportExcel); // Xuất thống kê phòng ra file Excel
  router.get("/rooms/search", PhongController.search); // Tìm kiếm phòng
  router.get("/rooms/create", PhongController.create); // Trang tạo phòng
  router.post("/rooms", upload.array("images", 20), PhongController.store); // Lưu phòng mới
  router.get("/rooms/:maPhong", PhongController.detail); // Chi tiết phòng
  router.delete("/rooms/:maPhong", PhongController.destroy); // Xoá phòng
  router.get("/rooms/:maPhong/edit", PhongController.edit); // Trang chỉnh sửa phòng
  router.put(
    "/rooms/:maPhong",
    upload.array("images", 20),
    PhongController.update
  ); // Cập nhật phòng

  // ==== LeTan routes =====
  router.get("/reception", LeTanController.index); // Trang lễ tân
  router.put("/reception/update-status/:maPhong", LeTanController.updateStatus); // Cập nhật trạng thái phòng từ lễ tân

  //BookRooms
  router.get("/bookings", DatPhongController.index);
  router.get("/bookings/create", DatPhongController.create);
  router.get("/bookings/:maDatPhong", DatPhongController.detail);
  return app.use("/", router);
};

export default initWebRoutes;
