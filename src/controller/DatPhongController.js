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
    const rooms = await DatPhongDAO.getAvailableRooms(); // Lấy phòng trống
    const customers = await DatPhongDAO.getAllCustomers();
    const customer = customers[0] || null;
    return res.render("DatPhong/create.ejs", { rooms, customers, customer });
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
    const {
      HoVaTen,
      GioiTinh,
      NgaySinh,
      SDT,
      Email,
      NgayDat,
      NgayNhanPhong,
      NgayTraPhong,
      ChiTiet,
    } = req.body;

    // 1. Tạo khách hàng mới
    const customerResult = await DatPhongDAO.createCustomer({
      HoVaTen,
      GioiTinh,
      NgaySinh,
      SDT,
      Email,
    });

    if (!customerResult.success || !customerResult.customer) {
      req.flash("error", customerResult.message || "Lỗi tạo khách hàng mới");
      return res.redirect("/bookings/create");
    }

    const MaKhachHang = customerResult.customer.MaKhachHang;

    // 2. Tạo đơn đặt phòng
    const bookingData = {
      MaKhachHang,
      NgayDat,
      NgayNhanPhong,
      NgayTraPhong,
      ChiTiet,
    };

    const bookingResult = await DatPhongDAO.createBooking(bookingData);

    if (bookingResult.success) {
      req.flash("success", "Tạo đơn đặt phòng thành công");
      return res.redirect("/bookings");
    } else {
      req.flash("error", bookingResult.message);
      return res.redirect("/bookings/create");
    }
  } catch (error) {
    console.error("Error in createPost:", error);
    req.flash("error", "Lỗi tạo đơn đặt phòng");
    return res.redirect("/bookings/create");
  }
};

// Hiển thị form edit
const editForm = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    const booking = await DatPhongDAO.getBookingById(maDatPhong);
    const rooms = await DatPhongDAO.getAvailableRooms();
    const customers = await DatPhongDAO.getAllCustomers();

    if (!booking) {
      req.flash("error", "Không tìm thấy đơn đặt phòng");
      return res.redirect("/bookings");
    }

    res.render("DatPhong/edit.ejs", { booking, rooms, customers });
  } catch (error) {
    console.error(error);
    req.flash("error", "Không thể tải form chỉnh sửa");
    return res.redirect("/bookings");
  }
};
export const edit = async (req, res) => {
  try {
    const { maDatPhong } = req.params;

    const {
      HoVaTen,
      GioiTinh,
      NgaySinh,
      SDT,
      Email,
      NgayDat,
      NgayNhanPhong,
      NgayTraPhong,
      ChiTiet,
    } = req.body;

    const updateData = {
      HoVaTen,
      GioiTinh,
      NgaySinh,
      SDT,
      Email,
      NgayDat,
      NgayNhanPhong,
      NgayTraPhong,
      ChiTiet,
    };

    const result = await DatPhongDAO.updateBooking(maDatPhong, updateData);

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

export default {
  index,
  detail,
  create,
  newCustomer,
  createPost,
  editForm,
  edit,
  destroy,
};
