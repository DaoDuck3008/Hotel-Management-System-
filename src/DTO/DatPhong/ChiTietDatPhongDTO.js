class ChiTietDatPhongDTO {
  constructor({ MaCTDatPhong, MaDatPhong, MaPhong }) {
    this._maCTDatPhong = MaCTDatPhong;
    this._maDatPhong = MaDatPhong;
    this._maPhong = MaPhong;
  }

  get maCTDatPhong() {
    return this._maCTDatPhong;
  }
  set maCTDatPhong(v) {
    this._maCTDatPhong = v;
  }

  get maDatPhong() {
    return this._maDatPhong;
  }
  set maDatPhong(v) {
    this._maDatPhong = v;
  }

  get maPhong() {
    return this._maPhong;
  }
  set maPhong(v) {
    this._maPhong = v;
  }
}

module.exports = ChiTietDatPhongDTO;
