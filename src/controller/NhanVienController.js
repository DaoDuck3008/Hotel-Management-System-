import NhanVienDAO from "../DAO/NhanVienDAO";
import NhanVienDTO from "../DTO/NhanVien/NhanVienDTO";
import { createNhanVienSchema } from "../validators/NhanVienValidator.js";

//Hiển thị danh sách nhân viên
const index = async (req, res) => {
  const employees = await NhanVienDAO.getAll();
  return res.render("NhanSu/index.ejs", { employees });
};

//Mở form tạo nhân viên mới
const create = async (req, res) => {
  return res.render("NhanSu/create.ejs");
};

//Lưu nhân viên mới
const store = async (req, res) => {
  try {
    // Validate dữ liệu đầu vào
    const { error } = createNhanVienSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    // Nếu dữ liệu không hợp lệ, thì trả về lỗi
    if (error) {
      req.flash(
        "error",
        error.details.map((err) => err.message)
      );
      return res.redirect("/employees/create");
    }

    // Tạo đối tượng nhân viên
    let employeeDTO = new NhanVienDTO(req.body);
    employeeDTO.ImgURL = req.file;

    const result = await NhanVienDAO.create(employeeDTO);

    // Kiểm tra kết quả trả về từ DAO
    if (!result.success) {
      console.error("Error in create NhanViencontroller:", result.message);
      return res.redirect("/employees");
    }

    req.flash("success", "Tạo nhân viên thành công!");
    return res.redirect("/employees");
  } catch (e) {
    console.error("Error in store NhanViencontroller:", e);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/employees/create");
  }
};

// Xem chi tiết thông tin nhân viên
const detail = async (req, res) => {
  try {
    const { MaNV } = req.params;
    const employee = await NhanVienDAO.getById(MaNV);
    return res.render("NhanSu/detail.ejs", { employee: employee });
  } catch (error) {
    console.error("Error in NhanVienController: ", error);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/employees");
  }
};

//Mở form chỉnh sửa nhân viên
const edit = async (req, res) => {
  try {
    // Lấy mã nhân viên từ tham số URL
    const { MaNV } = req.params;
    const employee = await NhanVienDAO.getById(MaNV);

    // Kiểm tra nhân viên tồn tại
    if (!employee) {
      console.error(
        "Error in edit NhanViencontroller: Nhân Viên không tồn tại!"
      );
      req.flash("error", "Nhân Viên không tồn tại!");
      return res.redirect("/employees");
    }

    return res.render("NhanSu/edit.ejs", { employee });
  } catch (error) {
    console.error("Error in edit NhanViencontroller:", error);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/employees");
  }
};

//Chỉnh sửa nhân viên
const update = async (req, res) => {
  console.log(">>> req.body", req.body);
  try {
    // Validate dữ liệu đầu vào
    const { error } = createNhanVienSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    // Nếu dữ liệu không hợp lệ, thì trả về lỗi
    if (error) {
      req.flash(
        "error",
        error.details.map((err) => err.message)
      );
      return res.redirect("/employees/edit/" + req.params.MaNV);
    }

    const MaNV = req.params.MaNV;

    // Tạo đối tượng nhân viên mới
    let employeeDTO = new NhanVienDTO(req.body);
    employeeDTO.ImgURL = req.file;

    const result = await NhanVienDAO.update(employeeDTO, MaNV);

    if (!result.success) {
      console.error("Error in update NhanViencontroller:", result.message);
      return res.redirect("/employees");
    }

    req.flash("success", "Cập nhật nhân viên thành công!");
    return res.redirect("/employees");
  } catch (error) {
    console.error("Error in update NhanViencontroller:", error);
    return res.redirect("/employees");
  }
};

//Xóa nhân viên
const destroy = async (req, res) => {
  try {
    const { MaNV } = req.params;

    const employee = await NhanVienDAO.getById(MaNV); // Kiểm tra nhanvien tồn tại

    // Nếu nhanvien không tồn tại, trả về thông báo lỗi
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Nhân Viên không tồn tại!", success: false });
    }

    const result = await NhanVienDAO.delete(MaNV); // Gọi DAO để xóa nhan vien

    // Kiểm tra kết quả trả về từ DAO
    if (!result.success) {
      req.flash("error", "Xóa nhân viên thất bại!");
      return res.redirect("/employees");
    }

    req.flash("success", "Xóa nhân viên thành công!");
    return res.redirect("/employees");
  } catch (error) {
    console.error("Error in delete NhanViencontroller:", error);
    req.flash("error", "Đã xảy ra lỗi!");
    return res.redirect("/employees");
  }
};

//Tìm kiếm nhân viên
const search = async (req, res) => {
  try {
    const employees = await NhanVienDAO.search(req.query);
    return res.render("NhanSu/index.ejs", { employees });
  } catch (error) {
    console.error("Error in NhanVienController: ", error);
    return res.redirect("/employees");
  }
};

module.exports = {
  create,
  edit,
  update,
  destroy,
  detail,
  index,
  store,
  search,
};
