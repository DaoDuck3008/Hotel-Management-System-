import NhanVienDAO from "../DAO/NhanVienDAO";
import db from "../models/index";
import NhanVienDTO from "../DTO/NhanVien/NhanVienDTO";

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
  // Tạo đối tượng nhân viên
  let employeeDTO = new NhanVienDTO(req.body);
  employeeDTO.ImgURL = req.file;

  const result = await NhanVienDAO.create(employeeDTO);

  if (!result.success) {
    console.error("Error in create NhanViencontroller:", result.message);
    return res.redirect("/employees");
  }
  return res.redirect("/employees");
};

const detail = async (req, res) => {
  try {
    const { MaNV } = req.params;
    const employee = await NhanVienDAO.getById(MaNV);
    return res.render("NhanSu/detail.ejs", { employee: employee });
  } catch (error) {
    console.error("Error in NhanVienController: ", error);
    return res.redirect("/employees");
  }
};

//Mở form chỉnh sửa nhân viên
const edit = async (req, res) => {
  const { MaNV } = req.params;
  const employee = await NhanVienDAO.getById(MaNV);

  if (!employee) {
    console.error("Error in edit NhanViencontroller: Nhân Viên không tồn tại!");
    req.flash("error", "Nhân Viên không tồn tại!");
    return res.redirect("/employees");
  }

  return res.render("NhanSu/edit.ejs", { employee });
};

//Chỉnh sửa nhân viên
const update = async (req, res) => {
  try {
    const MaNV = req.params.MaNV;

    // Tạo đối tượng nhân viên mới
    let employeeDTO = new NhanVienDTO(req.body);
    employeeDTO.ImgURL = req.file;

    const result = await NhanVienDAO.update(employeeDTO, MaNV);

    if (!result.success) {
      console.error("Error in update NhanViencontroller:", result.message);
      return res.redirect("/employees");
    }

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
      return res
        .status(500)
        .json({ message: "Xóa nhan vien thất bại!", success: false });
    }

    return res.redirect("/employees");
  } catch (error) {
    console.error("Error in delete NhanViencontroller:", error);
    return res
      .status(500)
      .json({ message: "Xóa nhan vien thất bại!", success: false });
  }
};

//Tìm kiếm
const search = async (req, res) => {
  try {
    const { searchData } = req.query;
    console.log("SearchData: ", searchData);
    const employees = await NhanVienDAO.search(searchData);
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
