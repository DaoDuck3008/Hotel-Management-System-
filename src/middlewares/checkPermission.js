module.exports = function checkPermission(requiredPermission) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      req.flash("error", "Vui lòng đăng nhập để tiếp tục.");
      return res.redirect("/login"); // Chưa đăng nhập
    }

    const role = user.PhongBan;
    const rolePermissions = requiredPermission || [];

    // Admin có full quyền
    if (rolePermissions.includes("*")) {
      return next();
    }

    // Nếu role có quyền
    if (rolePermissions.includes(role)) {
      return next();
    }

    return res.send("Bạn không có quyền truy cập vào trang này.");
  };
};
