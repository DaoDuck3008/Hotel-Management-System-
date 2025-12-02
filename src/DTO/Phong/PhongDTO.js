class PhongDTO {
  constructor({
    MaPhong,
    TenLoaiPhong,
    TenPhong,
    SucChua,
    SoGiuong,
    GiaNgayCB,
    GiaGioCB,
    MoTa,
  }) {
    this._maPhong = MaPhong;
    this._tenLoaiPhong = TenLoaiPhong;
    this._tenPhong = TenPhong;
    this._sucChua = SucChua;
    this._soGiuong = SoGiuong;
    this._giaNgayCoBan = GiaNgayCB;
    this._giaGioCoBan = GiaGioCB;
    this._moTa = MoTa;
  }

  get maPhong() {
    return this._maPhong;
  }
  set maPhong(v) {
    this._maPhong = v;
  }

  get tenLoaiPhong() {
    return this._tenLoaiPhong;
  }
  set tenLoaiPhong(v) {
    this._tenLoaiPhong = v;
  }

  get tenPhong() {
    return this._tenPhong;
  }
  set tenPhong(v) {
    this._tenPhong = v;
  }

  get sucChua() {
    return this._sucChua;
  }
  set sucChua(v) {
    this._sucChua = v;
  }

  get soGiuong() {
    return this._soGiuong;
  }
  set soGiuong(v) {
    this._soGiuong = v;
  }

  get giaNgayCoBan() {
    return this._giaNgayCoBan;
  }
  set giaNgayCoBan(v) {
    this._giaNgayCoBan = v;
  }

  get giaGioCoBan() {
    return this._giaGioCoBan;
  }
  set giaGioCoBan(v) {
    this._giaGioCoBan = v;
  }

  get moTa() {
    return this._moTa;
  }
  set moTa(v) {
    this._moTa = v;
  }
}

module.exports = PhongDTO;
