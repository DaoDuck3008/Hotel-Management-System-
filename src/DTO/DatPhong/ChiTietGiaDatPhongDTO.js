class ChiTietGiaDatPhongDTO {
  constructor(ChiTietGia) {
    this.MaCTGiaDatPhong = ChiTietGia.MaCTGiaDatPhong || null;
    this.Ngay = ChiTietGia.Ngay;
    this.GiaNgay = ChiTietGia.GiaNgay;
    this.GiaGio = ChiTietGia.GiaGio;
    this.LoaiGia = ChiTietGia.LoaiGia;
  }

  get maCTGiaDatPhong() {
    return this.MaCTGiaDatPhong;
  }
  set maCTGiaDatPhong(v) {
    this.MaCTGiaDatPhong = v;
  }

  get ngay() {
    return this.Ngay;
  }
  set ngay(v) {
    this.Ngay = v;
  }

  get giaNgay() {
    return this.GiaNgay;
  }
  set giaNgay(v) {
    this.GiaNgay = v;
  }

  get giaGio() {
    return this.GiaGio;
  }
  set giaGio(v) {
    this.GiaGio = v;
  }

  get loaiGia() {
    return this.LoaiGia;
  }
  set loaiGia(v) {
    this.LoaiGia = v;
  }
}

module.exports = ChiTietGiaDatPhongDTO;
