import DatPhongDAO from "../DAO/DatPhongDAO.js";
import PhongDAO from "../DAO/PhongDAO.js";
import BookingDetailDTO from "../DTO/DatPhong/BookingDetailDTO.js";

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
    return res.render("DatPhong/create.ejs");
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể hiển thị form tạo mới");
    return res.redirect("/bookings");
  }
};

const newCustomer = async (req, res) => {
  try {
    const newCustomer = await DatPhongDAO.getNewCustomers();
    return res.render("DatPhong/create.ejs", { newCustomer });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể hiển thị form tạo mới");
    return res.redirect("/bookings");
  }
};

const createPost = async (req, res) => {
  try {
    const { rooms } = req.body;
    const _rooms = JSON.parse(rooms);

    let bookingDTO = new BookingDetailDTO(req.body);
    bookingDTO.ChiTiet = _rooms;

    const result = await DatPhongDAO.createBooking(bookingDTO);

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/bookings/create");
    }

    req.flash("success", "Tạo đơn đặt phòng thành công");
    return res.redirect("/bookings");
  } catch (error) {
    console.error("Create booking error:", error);
    req.flash("error", "Có lỗi khi tạo đơn đặt phòng");
    return res.redirect("/bookings/create");
  }
};

// Hiển thị form edit
const editForm = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    const booking = await DatPhongDAO.getBookingById(maDatPhong);
    const allRooms = await PhongDAO.getAll();

    if (!booking) {
      req.flash("error", "Không tìm thấy đơn đặt phòng");
      return res.redirect("/bookings");
    }

    req.flash("success", "Tải form chỉnh sửa thành công");
    res.render("DatPhong/edit.ejs", { booking, allRooms });
  } catch (error) {
    console.error(error);
    req.flash("error", "Không thể tải form chỉnh sửa");
    return res.redirect("/bookings");
  }
};

export const edit = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    const { rooms } = req.body;
    const _rooms = JSON.parse(rooms);

    // tạo đối tượng mới
    let bookingDTO = new BookingDetailDTO(req.body);
    bookingDTO.ChiTiet = _rooms;

    const result = await DatPhongDAO.updateBooking(maDatPhong, bookingDTO);

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect(`/bookings/${maDatPhong}/edit`);
    }

    req.flash("success", "Cập nhật đơn đặt phòng thành công");
    return res.redirect("/bookings");
  } catch (error) {
    console.error("Edit error:", error);
    req.flash("error", "Có lỗi khi cập nhật đơn đặt phòng");
    return res.redirect(`/bookings/${req.params.maDatPhong}/edit`);
  }
};

export const destroy = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    const result = await DatPhongDAO.deleteBooking(maDatPhong);

    if (result.success) {
      req.flash("success", result.message);
    } else {
      req.flash("error", result.message);
    }

    return res.redirect("/bookings");
  } catch (err) {
    console.error("Error deleting booking:", err);
    req.flash("error", "Xóa đơn đặt phòng thất bại");
    return res.redirect("/bookings");
  }
};

const getPriceRange = async (req, res) => {
  try {
    const { MaPhong, from, to } = req.query;

    const prices = await PhongDAO.getPriceRange(MaPhong, from, to);

    return res.json({ prices });
  } catch (error) {
    console.error("Error in getPriceRange:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const { from, to } = req.query;
    console.log(">>> Fetching available rooms from", from, "to", to);

    const availableRooms = await DatPhongDAO.getAvailableRooms(from, to);

    return res.json({
      success: true,
      rooms: availableRooms,
    });
  } catch (error) {
    console.error("Error in getAvailableRooms:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export default {
  index,
  detail,
  create,
  newCustomer,
  createPost,
  editForm,
  edit,
  destroy,
  getAvailableRooms,
  getPriceRange,
};
