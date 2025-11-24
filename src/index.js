import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import session from "express-session";
import flash from "connect-flash";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Config view engine
configViewEngine(app);

// Config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config method override
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Static files
app.use(express.static("public"));

// Config session & flash
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Dùng biến global để EJS truy cập được
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  next();
});

// Test connection DB
connectDB();

// Init web routes
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(">>>App is running on port:  " + PORT);
});
