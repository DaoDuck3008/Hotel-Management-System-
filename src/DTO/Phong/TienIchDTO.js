class TienIchDTO {
  constructor({ MaTienIch, TenTienIch, IconURL, MoTa }) {
    this.MaTienIch = MaTienIch;
    this.TenTienIch = TenTienIch;
    this.IconURL = IconURL;
    this.MoTa = MoTa;
  }

  get id() {
    return this.MaTienIch;
  }
  set id(v) {
    this.MaTienIch = v;
  }

  get ten() {
    return this.TenTienIch;
  }
  set ten(v) {
    this.TenTienIch = v;
  }

  get icon() {
    return this.IconURL;
  }
  set icon(v) {
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
