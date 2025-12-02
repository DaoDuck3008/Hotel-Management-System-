class ChiTietGiaDatPhongDTO {
  constructor({ MaCTGiaDatPhong, Ngay, GiaNgay, GiaGio, LoaiGia }) {
    this._maCTGiaDatPhong = MaCTGiaDatPhong;
    this._ngay = Ngay;
    this._giaNgay = GiaNgay;
    this._giaGio = GiaGio;
    this._loaiGia = LoaiGia;
  }

  get maCTGiaDatPhong() {
    return this._maCTGiaDatPhong;
  }
  set maCTGiaDatPhong(v) {
    this._maCTGiaDatPhong = v;
  }

  get ngay() {
    return this._ngay;
  }
  set ngay(v) {
    this._ngay = v;
  }

  get giaNgay() {
    return this._giaNgay;
  }
  set giaNgay(v) {
    this._giaNgay = v;
  }

  get giaGio() {
    return this._giaGio;
  }
  set giaGio(v) {
    this._giaGio = v;
  }

  get loaiGia() {
    return this._loaiGia;
  }
  set loaiGia(v) {
    this._loaiGia = v;
  }
}

module.exports = ChiTietGiaDatPhongDTO;
