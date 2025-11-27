import DatPhongDAO from "../DAO/DatPhongDAO.js";

// Hiển thị danh sách đặt phòng
const index = async (req, res) => {
  const bookings = await DatPhongDAO.getAllBookings();
  return res.render("DatPhong/index.ejs", { bookings });
};

// Xem chi tiết đơn đặt phòng
const detail = async (req, res) => {
  try {
    const { maDatPhong } = req.params;
    const booking = await DatPhongDAO.getBookingById(maDatPhong);

    if (!booking) {
      req.flash("error", "Không tìm thấy đơn đặt phòng");
      return res.redirect("/bookings");
    }

    return res.render("DatPhong/detail.ejs", { booking });
  } catch (error) {
    console.error("Error in booking detail:", error);
    req.flash("error", "Có lỗi xảy ra khi tải chi tiết đặt phòng");
    return res.redirect("/bookings");
  }
};

const create = async (req, res) => {
  try {
    const rooms = await DatPhongDAO.getAvailableRooms();
    return res.render("DatPhong/create.ejs", { rooms });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể hiển thị form tạo mới");
    return res.redirect("/bookings");
  }
};

module.exports = {
  index,
  detail,
  create,
};
