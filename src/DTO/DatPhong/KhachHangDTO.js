class KhachHangDTO {
  constructor({ MaKhachHang, HoVaTen, GioiTinh, NgaySinh, SDT, Email }) {
    this._maKhachHang = MaKhachHang;
    this._hoVaTen = HoVaTen;
    this._gioiTinh = GioiTinh;
    this._ngaySinh = NgaySinh;
    this._sdt = SDT;
    this._email = Email;
  }

  get maKhachHang() {
    return this._maKhachHang;
  }
  set maKhachHang(v) {
    this._maKhachHang = v;
  }

  get hoVaTen() {
    return this._hoVaTen;
  }
  set hoVaTen(v) {
    this._hoVaTen = v;
  }

  get gioiTinh() {
    return this._gioiTinh;
  }
  set gioiTinh(v) {
    this._gioiTinh = v;
  }

  get ngaySinh() {
    return this._ngaySinh;
  }
  set ngaySinh(v) {
    this._ngaySinh = v;
  }

  get sdt() {
    return this._sdt;
  }
  set sdt(v) {
    this._sdt = v;
  }

  get email() {
    return this._email;
  }
  set email(v) {
    this._email = v;
  }
}

module.exports = KhachHangDTO;
