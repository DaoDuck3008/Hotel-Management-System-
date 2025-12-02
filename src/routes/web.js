import express from "express";
import PhongController from "../controller/PhongController.js";
import LeTanController from "../controller/LeTanController.js";
import upload from "../middlewares/upload.js";
import DatPhongController from "../controller/DatPhongController.js";
import AuthController from "../controller/AuthController.js";
import checkPermission from "../middlewares/checkPermission.js";
import NhanVienController from "../controller/NhanVienController.js";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello World!");
  });

  router.get("/login", AuthController.loginPage);
  router.post("/login", AuthController.login);
  router.get("/logout", AuthController.logout);

  // ======= Nhan Vien routes =========
  router.get(
    "/employees",
    checkPermission(["NhanSu"]),
    NhanVienController.index
  );
  router.get(
    "/employees/create",
    checkPermission(["NhanSu"]),
    NhanVienController.create
  );
  router.post(
    "/employees",
    checkPermission(["NhanSu"]),
    upload.single("image"),
    NhanVienController.store
  );
  router.post(
    "/employees/update/:MaNV",
    checkPermission(["NhanSu"]),
    upload.single("image"),
    NhanVienController.update
  );
  router.get(
    "/employees/:MaNV",
    checkPermission(["NhanSu"]),
    NhanVienController.detail
  ); //Chi tiết nhân viên

  router.get(
    "/employees/delete/:MaNV",
    checkPermission(["NhanSu"]),
    NhanVienController.destroy
  );
  router.get(
    "/employees/edit/:MaNV",
    checkPermission(["NhanSu"]),
    NhanVienController.edit
  );

  //  ===== Phong routes =====
  router.get(
    "/rooms",
    checkPermission(["Phong", "KinhDoanh", "LeTan"]),
    PhongController.index
  ); // Lấy danh sách phòng
  router.get(
    "/rooms/statistics",
    checkPermission(["Phong"]),
    PhongController.statistics
  ); // Thống kê phòng
  router.get(
    "/rooms/statistics/export",
    checkPermission(["Phong"]),
    PhongController.exportExcel
  ); // Xuất thống kê phòng ra file Excel
  router.get(
    "/rooms/search",
    checkPermission(["Phong", "KinhDoanh", "LeTan"]),
    PhongController.search
  ); // Tìm kiếm phòng
  router.get(
    "/rooms/create",
    checkPermission(["Phong"]),
    PhongController.create
  ); // Trang tạo phòng
  router.post(
    "/rooms",
    checkPermission(["Phong"]),
    upload.array("images", 20),
    PhongController.store
  ); // Lưu phòng mới
  router.get(
    "/rooms/:maPhong",
    checkPermission(["Phong", "KinhDoanh", "LeTan"]),
    PhongController.detail
  ); // Chi tiết phòng
  router.delete(
    "/rooms/:maPhong",
    checkPermission(["Phong"]),
    PhongController.destroy
  ); // Xoá phòng
  router.get(
    "/rooms/:maPhong/edit",
    checkPermission(["Phong"]),
    PhongController.edit
  ); // Trang chỉnh sửa phòng
  router.put(
    "/rooms/:maPhong",
    checkPermission(["Phong"]),
    upload.array("images", 20),
    PhongController.update
  ); // Cập nhật phòng

  // Bộ phận lễ tân
  router.get("/receptions", checkPermission(["LeTan"]), LeTanController.index);
  router.put(
    "/receptions/update-status/:maPhong",
    checkPermission(["LeTan"]),
    LeTanController.updateStatus
  );
  router.get(
    "/receptions/payment",
    checkPermission(["LeTan"]),
    LeTanController.paymentList
  );
  router.get(
    "/receptions/payment/:maDatPhong",
    checkPermission(["LeTan"]),
    LeTanController.paymentDetail
  );
  router.post(
    "/receptions/payment/:maDatPhong",
    checkPermission(["LeTan"]),
    LeTanController.processPayment
  );

  //BookRooms
  router.get(
    "/bookings",
    checkPermission(["KinhDoanh"]),
    DatPhongController.index
  );
  router.get(
    "/bookings/create",
    checkPermission(["KinhDoanh"]),
    DatPhongController.create
  );
  router.get(
    "/bookings/:maDatPhong",
    checkPermission(["KinhDoanh"]),
    DatPhongController.detail
  );
  router.post(
    "/bookings/create",
    checkPermission(["KinhDoanh"]),
    DatPhongController.createPost
  );
  router.get(
    "/bookings/:maDatPhong/edit",
    checkPermission(["KinhDoanh"]),
    DatPhongController.editForm
  ); // GET form
  router.post(
    "/bookings/:maDatPhong/edit",
    checkPermission(["KinhDoanh"]),
    DatPhongController.edit
  ); // POST form
  router.post(
    "/bookings/:maDatPhong/delete",
    checkPermission(["KinhDoanh"]),
    DatPhongController.destroy
  );

  router.get("/api/rooms/available", DatPhongController.getAvailableRooms); // API lấy phòng trống theo khoảng ngày
  router.get("/api/rooms/price-range", DatPhongController.getPriceRange); // API lấy giá phòng được chọn theo khoảng ngày

  return app.use("/", router);
};

export default initWebRoutes;
