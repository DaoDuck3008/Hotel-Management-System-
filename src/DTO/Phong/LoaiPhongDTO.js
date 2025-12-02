class LoaiPhongDTO {
  constructor({ TenLoaiPhong, MoTa }) {
    this.TenLoaiPhong = TenLoaiPhong;
    this.MoTa = MoTa;
  }

  get tenLoaiPhong() {
    return this.TenLoaiPhong;
  }
  set tenLoaiPhong(v) {
    this.TenLoaiPhong = v;
  }

  get moTa() {
    return this._moTa;
  }
  set moTa(v) {
    this.MoTa = v;
  }
}

module.exports = LoaiPhongDTO;
