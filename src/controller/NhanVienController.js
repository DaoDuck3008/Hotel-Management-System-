import NhanVienDAO from "../DAO/NhanVienDAO";
import db from "../models/index";
import ExcelJS from "exceljs";

//Hiển thị danh sách nhân viên
const index = async (req, res) => {
  const employees = await NhanVienDAO.getAll();
  return res.render("NhanSu/index.ejs", { employees });
};

//Mở form tạo nhân viên mới
const create = async (req, res) => {
  // const MaNV = req.body.MaNV;
  // const HoTen = req.body.HoTen;
  // const NgayVaoLam = req.body.NgayVaoLam;
  // const NgaySinh = req.body.NgaySinh;
  // const PhongBan = req.body.PhongBan;
  // const SDT = req.body.SDT;
  // const Email = req.body.Email;
  // const ImgURL = req.body.ImgURL;
  // const TrangThai = req.body.TrangThai;
  return res.render("NhanSu/create.ejs");
};

//Lưu nhân viên mới
const store = async (req, res) => {
  const result = await NhanVienDAO.create(req.body);
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

//Mmowr form chỉnh sửa nhân viên
const edit = async (req, res) => {
  const { MaNV } = req.params;
  const employee = await NhanVienDAO.getById(MaNV);
  return res.render("NhanSu/edit.ejs", { employee });
};

//Chỉnh sửa nhân viên
const update = async (req, res) => {
  const MaNV = req.params.MaNV;
  const result = await NhanVienDAO.update(req.body, MaNV);
  return res.redirect("/employees", { result });
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

// const statistics = async (req, res) => {};

// const exportExcel = async (req, res) => {};

module.exports = {
  create,
  edit,
  update,
  destroy,
  detail,
  index,
  store,
  search,
  //   statistics,
  //   exportExcel,
};
