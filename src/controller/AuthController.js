import db from "../models/index.js";

const loginPage = (req, res) => {
  return res.render("Auth/login.ejs");
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "Vui lòng nhập đầy đủ email và mật khẩu.",
      });
    }

    // 1. Tìm user theo email
    const user = await db.NhanVien.findOne({ where: { Email: email } });

    if (!user || user.Password !== password) {
      return res.render("login", { error: "Sai email hoặc mật khẩu!" });
    }

    // 3. Lưu thông tin user vào session
    req.session.user = {
      MaNhanVien: user.MaNhanVien,
      HoTen: user.HoTen,
      Email: user.Email,
      PhongBan: user.PhongBan,
    };

    // 4. Tùy chọn: Chuyển hướng theo phòng ban
    switch (user.PhongBan) {
      case "LeTan":
        req.flash("success", "Đăng nhập thành công!");
        return res.redirect("/receptions");

      case "Phong":
        req.flash("success", "Đăng nhập thành công!");
        return res.redirect("/rooms");

      case "NhanSu":
        req.flash("success", "Đăng nhập thành công!");
        return res.redirect("/employees");

      case "KinhDoanh":
        req.flash("success", "Đăng nhập thành công!");
        return res.redirect("/bookings");

      default:
        req.flash("success", "Đăng nhập thành công!");
        return res.redirect("/");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "Đã xảy ra lỗi trong quá trình đăng nhập.");
    return res.render("login");
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = {
  loginPage,
  login,
  logout,
};
