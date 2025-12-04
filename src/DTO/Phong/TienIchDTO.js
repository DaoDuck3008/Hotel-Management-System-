class TienIchDTO {
  constructor({ MaTienIch, TenTienIch, IconURL, MoTa }) {
    this.MaTienIch = MaTienIch;
    this.TenTienIch = TenTienIch;
    this.IconURL = IconURL;
    this.MoTa = MoTa;
  }

  get maTienIch() {
    return this.MaTienIch;
  }
  set maTienIch(v) {
    this.MaTienIch = v;
  }

  get tenTienIch() {
    return this.TenTienIch;
  }
  set tenTienIch(v) {
    this.TenTienIch = v;
  }

  get iconURL() {
    return this.IconURL;
  }
  set iconURL(v) {
    this.IconURL = v;
  }

  get moTa() {
    return this.MoTa;
  }
  set moTa(v) {
    this.MoTa = v;
  }
}

module.exports = TienIchDTO;
