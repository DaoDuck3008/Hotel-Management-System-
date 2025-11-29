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

  // Bộ phận lễ tân
  router.get("/receptions", LeTanController.index); //Lấy thống kê và danh sách phòng
  router.put(
    "/receptions/update-status/:maPhong",
    LeTanController.updateStatus
  ); //cập nhật trạng thái phòng
  router.get("/receptions/payment", LeTanController.paymentList); //lấy danh sách đơn đặt phòng
  router.get("/receptions/payment/:maDatPhong", LeTanController.paymentDetail); //Lấy thông tin đơn đặt phòng đó
  router.post(
    "/receptions/payment/:maDatPhong",
    LeTanController.processPayment
  ); //Thanh toán phòng

  //BookRooms
  router.get("/bookings", DatPhongController.index);
  router.get("/bookings/create", DatPhongController.create);
  router.get("/bookings/:maDatPhong", DatPhongController.detail);
  router.post("/bookings/create", DatPhongController.createPost);
  router.get("/bookings/:maDatPhong/edit", DatPhongController.editForm); // GET form
  router.post("/bookings/:maDatPhong/edit", DatPhongController.edit); // POST form
  router.post("/bookings/:maDatPhong/delete", DatPhongController.destroy);
  router.get("/api/rooms/available", DatPhongController.getAvailableRooms); // API lấy phòng trống theo khoảng ngày
  router.get("/api/rooms/price-range", DatPhongController.getPriceRange); // API lấy giá phòng được chọn theo khoảng ngày

  return app.use("/", router);
};

export default initWebRoutes;
