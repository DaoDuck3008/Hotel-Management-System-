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

  router.get("/rooms", PhongController.index);
  router.get("/rooms/statistics", PhongController.statistics);
  router.get("/rooms/statistics/export", PhongController.exportExcel);
  router.get("/rooms/search", PhongController.search);
  router.get("/rooms/create", PhongController.create);
  router.post("/rooms", upload.array("images", 20), PhongController.store);
  router.get("/rooms/:maPhong", PhongController.detail);
  router.delete("/rooms/:maPhong", PhongController.destroy);
  router.get("/rooms/:maPhong/edit", PhongController.edit);
  router.put(
    "/rooms/:maPhong",
    upload.array("images", 20),
    PhongController.update
  );

  // Bộ phận lễ tân
  router.get("/receptions", LeTanController.index);
  router.put(
    "/receptions/update-status/:maPhong",
    LeTanController.updateStatus
  );
  router.get("/receptions/payment", LeTanController.paymentList);
  router.get("/receptions/payment/:maDatPhong", LeTanController.paymentDetail);
  router.post(
    "/receptions/payment/:maDatPhong",
    LeTanController.processPayment
  );

  //BookRooms
  router.get("/bookings", DatPhongController.index);
  router.get("/bookings/create", DatPhongController.create);
  router.get("/bookings/:maDatPhong", DatPhongController.detail);
  router.post("/bookings/create", DatPhongController.createPost);
  router.get("/bookings/:maDatPhong/edit", DatPhongController.editForm); // GET form
  router.post("/bookings/:maDatPhong/edit", DatPhongController.edit); // POST form
  router.post("/bookings/:maDatPhong/delete", DatPhongController.destroy);

  return app.use("/", router);
};

export default initWebRoutes;
