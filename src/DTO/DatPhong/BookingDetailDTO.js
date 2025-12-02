const DatPhongDTO = require("./DatPhongDTO");
const ChiTietDatPhongDTO = require("./ChiTietDatPhongDTO");
const ChiTietGiaDatPhongDTO = require("./ChiTietGiaDatPhongDTO");
const KhachHangDTO = require("../khachhang/KhachHangDTO");
const PhongDTO = require("../phong/PhongDTO");
// Nếu muốn có full detail phòng thì dùng RoomDetailDTO thay thế PhongDTO

class DatPhongDetailDTO {
  constructor(raw) {
    // raw = kết quả từ Sequelize query include

    // -------- Đặt phòng --------
    this._datPhong = new DatPhongDTO(raw);

    // -------- Khách hàng --------
    this._khachHang = raw.khachhang ? new KhachHangDTO(raw.khachhang) : null;

    // -------- Danh sách phòng đã đặt --------
    this._danhSachPhong = Array.isArray(raw.chitietdatphongs)
      ? raw.chitietdatphongs.map((ct) => {
          const ctDTO = new ChiTietDatPhongDTO(ct);
          // include phòng
          if (ct.phong) ctDTO.phong = new PhongDTO(ct.phong);
          return ctDTO;
        })
      : [];

    // -------- Chi tiết giá theo ngày --------
    this._chiTietGiaTheoNgay = Array.isArray(raw.chitietgiadatrophongs)
      ? raw.chitietgiadatrophongs.map((g) => new ChiTietGiaDatPhongDTO(g))
      : [];
  }

  // === GETTERS ===
  get datPhong() {
    return this._datPhong;
  }

  get khachHang() {
    return this._khachHang;
  }

  get danhSachPhong() {
    return this._danhSachPhong;
  }

  get chiTietGiaTheoNgay() {
    return this._chiTietGiaTheoNgay;
  }
}

module.exports = DatPhongDetailDTO;
