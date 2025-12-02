class DatPhongDTO {
  constructor({
    MaDatPhong,
    MaKhachHang,
    NgayDat,
    NgayNhanPhong,
    NgayTraPhong,
    TrangThaiThanhToan,
  }) {
    this._maDatPhong = MaDatPhong;
    this._maKhachHang = MaKhachHang;
    this._ngayDat = NgayDat;
    this._ngayNhanPhong = NgayNhanPhong;
    this._ngayTraPhong = NgayTraPhong;
    this._trangThaiThanhToan = TrangThaiThanhToan;
  }

  get maDatPhong() {
    return this._maDatPhong;
  }
  set maDatPhong(v) {
    this._maDatPhong = v;
  }

  get maKhachHang() {
    return this._maKhachHang;
  }
  set maKhachHang(v) {
    this._maKhachHang = v;
  }

  get ngayDat() {
    return this._ngayDat;
  }
  set ngayDat(v) {
    this._ngayDat = v;
  }

  get ngayNhanPhong() {
    return this._ngayNhanPhong;
  }
  set ngayNhanPhong(v) {
    this._ngayNhanPhong = v;
  }

  get ngayTraPhong() {
    return this._ngayTraPhong;
  }
  set ngayTraPhong(v) {
    this._ngayTraPhong = v;
  }

  get trangThaiThanhToan() {
    return this._trangThaiThanhToan;
  }
  set trangThaiThanhToan(v) {
    this._trangThaiThanhToan = v;
  }
}

module.exports = DatPhongDTO;
