class TrangThaiPhongDTO {
  constructor({ ThoiGianCapNhat, TrangThai }) {
    this.ThoiGianCapNhat = ThoiGianCapNhat;
    this.TrangThai = TrangThai;
  }

  get thoiGianCapNhat() {
    return this.ThoiGianCapNhat;
  }
  set thoiGianCapNhat(v) {
    this.ThoiGianCapNhat = v;
  }

  get trangThai() {
    return this.TrangThai;
  }
  set trangThai(v) {
    this.TrangThai = v;
  }
}

module.exports = TrangThaiPhongDTO;
