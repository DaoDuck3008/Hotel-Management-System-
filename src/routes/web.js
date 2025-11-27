import express from "express";
import PhongController from "../controller/PhongController.js";
import LeTanController from "../controller/LeTanController.js";
import upload from "../middlewares/upload.js";

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

  return app.use("/", router);
};

export default initWebRoutes;
