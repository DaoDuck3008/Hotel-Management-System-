import express from "express";
import PhongController from "../controllers/PhongController.js";
const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello World!");
  });

  router;

  return app.use("/", router);
};

export default initWebRoutes;
