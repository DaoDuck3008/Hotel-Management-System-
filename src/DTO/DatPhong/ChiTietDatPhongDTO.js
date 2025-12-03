const RoomDetailDTO = require("../Phong/RoomDetailDTO");
const ChiTietGiaDatPhongDTO = require("./ChiTietGiaDatPhongDTO");

class ChiTietDatPhongDTO {
  constructor(ChiTiet) {
    this.MaCTDatPhong = ChiTiet.MaCTDatPhong;
    this.MaDatPhong = ChiTiet.MaDatPhong;
    this.MaPhong = ChiTiet.MaPhong;

    this.Phong = new RoomDetailDTO(ChiTiet.Phong);
    this.ChiTietGiaDatPhong = ChiTiet.ChiTietGiaDatPhong.map(
      (c) => new ChiTietGiaDatPhongDTO(c)
    );
  }

  get maCTDatPhong() {
    return this.MaCTDatPhong;
  }
  set maCTDatPhong(v) {
    this.MaCTDatPhong = v;
  }

  get maDatPhong() {
    return this.MaDatPhong;
  }
  set maDatPhong(v) {
    this.MaDatPhong = v;
  }

  get maPhong() {
    return this.MaPhong;
  }
  set maPhong(v) {
    this.MaPhong = v;
  }
}

module.exports = ChiTietDatPhongDTO;
