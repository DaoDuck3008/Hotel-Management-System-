class NhanVienDTO {
  constructor({
    MaNV,
    HoTen,
    NgayVaoLam,
    NgaySinh,
    PhongBan,
    SDT,
    Email,
    ImgURL,
    TrangThai,
    GioiTinh,
    DiaChi,
    Password,
  }) {
    this.MaNV = MaNV;
    this.HoTen = HoTen;
    this.NgayVaoLam = NgayVaoLam;
    this.NgaySinh = NgaySinh;
    this.PhongBan = PhongBan;
    this.SDT = SDT;
    this.Email = Email;
    this.ImgURL = ImgURL;
    this.TrangThai = TrangThai;
    this.GioiTinh = GioiTinh;
    this.DiaChi = DiaChi;
    this.Password = Password;
  }

  get maNV() {
    return this.MaNV;
  }
  set maNV(v) {
    this.MaNV = v;
  }

  get hoTen() {
    return this.HoTen;
  }
  set hoTen(v) {
    this.HoTen = v;
  }

  get ngayVaoLam() {
    return this.NgayVaoLam;
  }
  set ngayVaoLam(v) {
    this.NgayVaoLam = v;
  }

  get ngaySinh() {
    return this.NgaySinh;
  }
  set ngaySinh(v) {
    this.NgaySinh = v;
  }

  get phongBan() {
    return this.PhongBan;
  }
  set phongBan(v) {
    this.PhongBan = v;
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

  get imgURL() {
    return this.ImgURL;
  }
  set imgURL(v) {
    this.ImgURL = v;
  }

  get trangThai() {
    return this.TrangThai;
  }
  set trangThai(v) {
    this.TrangThai = v;
  }

  get password() {
    return this.Password;
  }

  set password(v) {
    this.Password = v;
  }

  get diaChi() {
    return this.DiaChi;
  }

  set diaChi(v) {
    this.DiaChi = v;
  }

  get gioiTinh() {
    return this.GioiTinh;
  }

  set gioiTinh(v) {
    this.GioiTinh = v;
  }
}

module.exports = NhanVienDTO;
