class GiaPhongNgayLeDTO {
  constructor({ NgayLe, NgayBatDau, NgayKetThuc, GiaNgay, GiaGio }) {
    this.NgayLe = NgayLe;
    this.NgayBatDau = NgayBatDau;
    this.NgayKetThuc = NgayKetThuc;
    this.GiaNgay = GiaNgay;
    this.GiaGio = GiaGio;
  }

  get ngayLe() {
    return this.NgayLe;
  }
  set ngayLe(v) {
    this.NgayLe = v;
  }

  get ngayBatDau() {
    return this.NgayBatDau;
  }
  set ngayBatDau(v) {
    this.NgayBatDau = v;
  }

  get ngayKetThuc() {
    return this.NgayKetThuc;
  }
  set ngayKetThuc(v) {
    this.NgayKetThuc = v;
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
}

module.exports = GiaPhongNgayLeDTO;
