class HinhAnhDTO {
  constructor({ MaHinhAnh, ImgURL }) {
    this.MaHinhAnh = MaHinhAnh;
    this.ImgURL = ImgURL;
  }

  get maHinhAnh() {
    return this._id;
  }
  set maHinhAnh(v) {
    this.MaHinhAnh = v;
  }

  get imgURL() {
    return this.ImgURL;
  }
  set imgURL(v) {
    this.ImgURL = v;
  }
}

module.exports = HinhAnhDTO;
