import NhanVienDAO from "../DAO/NhanVienDAO";
import db from "../models/index";
import ExcelJS from "exceljs";

const index = async (req, res) => {
  const employees = await NhanVienDAO.getAll();
  return res.render("NhanSu/index.ejs", { employees });
};

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

const store = async (req, res) => {
  const result = await NhanVienDAO.create(req.body, req.file);

  if (!result.success) {
    console.error("Error in create NhanViencontroller:", result.message);
    return res.redirect("/employees");
  }
  return res.redirect("/employees");
};

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

const update = async (req, res) => {
  try {
    console.log("Update NhanVien with data:", req.file);
    const MaNV = req.params.MaNV;
    const result = await NhanVienDAO.update(req.body, req.file, MaNV);

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

// const search = async (req, res) => {};

// const statistics = async (req, res) => {};

// const exportExcel = async (req, res) => {};

module.exports = {
  create,
  edit,
  update,
  destroy,
  index,
  store,
  //   search,
  //   statistics,
  //   exportExcel,
};
