class GiaPhongTuanDTO {
  constructor({ ThuApDung, GiaNgay, GiaGio }) {
    this.ThuApDung = ThuApDung;
    this.GiaNgay = GiaNgay;
    this.GiaGio = GiaGio;
  }

  get thu() {
    return this.ThuApDung;
  }
  set thu(v) {
    this.ThuApDung = v;
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

module.exports = GiaPhongTuanDTO;
