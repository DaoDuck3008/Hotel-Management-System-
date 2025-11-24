import multer from "multer";
const path = require("path");

// Setup folder lưu file
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/uploads"),
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

// Validate file upload
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Chỉ hỗ trợ JPG, PNG, WEBP!"), false);
  }
  cb(null, true);
};

// Khởi tạo multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = upload;
