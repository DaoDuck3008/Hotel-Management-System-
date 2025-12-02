class PhongTienIchDTO {
  constructor({ MaPhong, MaTienIch }) {
    this.MaPhong = MaPhong;
    this.MaTienIch = MaTienIch;
  }

  get maPhong() {
    return this.MaPhong;
  }
  set maPhong(v) {
    this.MaPhong = v;
  }

  get maTienIch() {
    return this.MaTienIch;
  }
  set maTienIch(v) {
    this.MaTienIch = v;
  }
}

module.exports = PhongTienIchDTO;
