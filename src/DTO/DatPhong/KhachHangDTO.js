class KhachHangDTO {
  constructor({ MaKhachHang, HoVaTen, GioiTinh, NgaySinh, SDT, Email }) {
    this.MaKhachHang = MaKhachHang || null;
    this.HoVaTen = HoVaTen;
    this.GioiTinh = GioiTinh;
    this.NgaySinh = NgaySinh;
    this.SDT = SDT;
    this.Email = Email;
  }

  get maKhachHang() {
    return this._maKhachHang;
  }
  set maKhachHang(v) {
    this._maKhachHang = v;
  }

  get hoVaTen() {
    return this.HoVaTen;
  }
  set hoVaTen(v) {
    this.HoVaTen = v;
  }

  get gioiTinh() {
    return this.GioiTinh;
  }
  set gioiTinh(v) {
    this.GioiTinh = v;
  }

  get ngaySinh() {
    return this.NgaySinh;
  }
  set ngaySinh(v) {
    this.NgaySinh = v;
  }

  get sdt() {
    return this.SDT;
  }
  set sdt(v) {
    this.SDT = v;
  }

  get email() {
    return this.Email;
  }
  set email(v) {
    this.Email = v;
  }
}

module.exports = KhachHangDTO;
