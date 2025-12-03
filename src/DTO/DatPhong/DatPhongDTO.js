class DatPhongDTO {
  constructor({
    MaDatPhong,
    MaKhachHang,
    NgayDat,
    NgayNhanPhong,
    NgayTraPhong,
    TrangThaiThanhToan,
  }) {
    this.MaDatPhong = MaDatPhong;
    this.MaKhachHang = MaKhachHang;
    this.NgayDat = NgayDat;
    this.NgayNhanPhong = NgayNhanPhong;
    this.NgayTraPhong = NgayTraPhong;
    this.TrangThaiThanhToan = TrangThaiThanhToan;
  }

  get maDatPhong() {
    return this.MaDatPhong;
  }
  set maDatPhong(v) {
    this.MaDatPhong = v;
  }

  get maKhachHang() {
    return this.MaKhachHang;
  }
  set maKhachHang(v) {
    this.MaKhachHang = v;
  }

  get ngayDat() {
    return this.NgayDat;
  }
  set ngayDat(v) {
    this.NgayDat = v;
  }

  get ngayNhanPhong() {
    return this.NgayNhanPhong;
  }
  set ngayNhanPhong(v) {
    this.NgayNhanPhong = v;
  }

  get ngayTraPhong() {
    return this.NgayTraPhong;
  }
  set ngayTraPhong(v) {
    this.NgayTraPhong = v;
  }

  get trangThaiThanhToan() {
    return this.TrangThaiThanhToan;
  }
  set trangThaiThanhToan(v) {
    this.TrangThaiThanhToan = v;
  }
}

module.exports = DatPhongDTO;
