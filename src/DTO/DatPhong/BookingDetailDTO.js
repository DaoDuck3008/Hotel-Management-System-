const DatPhongDTO = require("./DatPhongDTO");
const ChiTietDatPhongDTO = require("./ChiTietDatPhongDTO");
const ChiTietGiaDatPhongDTO = require("./ChiTietGiaDatPhongDTO");
const KhachHangDTO = require("./KhachHangDTO");
const RoomDetailDTO = require("../Phong/RoomDetailDTO");

class BookingDetailDTO {
  constructor(raw) {
    // -------- Đặt phòng --------
    this.DatPhong = new DatPhongDTO(raw);

    // -------- Khách hàng --------
    this.KhachHang = raw.KhachHang ? new KhachHangDTO(raw.KhachHang) : raw;

    // // -------- Danh sách phòng đã đặt --------
    this.ChiTiet =
      raw.ChiTiet?.map((ct) => {
        const ctDTO = new ChiTietDatPhongDTO(ct);
        // include phòng
        if (ct.Phong) ctDTO.Phong = new RoomDetailDTO(ct.Phong);
        return ctDTO;
      }) || [];
  }

  get chiTiet() {
    return this.ChiTiet;
  }

  set chiTiet(rooms) {
    this.ChiTiet = rooms.map(
      (room) =>
        new ChiTietDatPhongDTO({
          MaCTDatPhong: null,
          MaDatPhong: null,
          MaPhong: room.MaPhong,
          Phong: null,
          ChiTietGiaDatPhong: room.ChiTietGiaDatPhong,
        })
    );
  }

  get datPhong() {
    return this.DatPhong;
  }

  get khachHang() {
    return this.KhachHang;
  }

  get chiTietGiaTheoNgay() {
    return this.ChiTietGiaDatPhong;
  }
}

module.exports = BookingDetailDTO;
