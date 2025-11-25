import express from "express";
import PhongController from "../controller/PhongController.js";
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

  return app.use("/", router);
};

export default initWebRoutes;
