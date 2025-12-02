const TrangThaiPhongDTO = require("./TrangThaiPhongDTO");
const HinhAnhDTO = require("./HinhAnhDTO");
const GiaPhongTuanDTO = require("./GiaPhongTuanDTO");
const GiaPhongNgayLeDTO = require("./GiaPhongNgayLeDTO");
const TienIchDTO = require("./TienIchDTO");
const LoaiPhongDTO = require("./LoaiPhongDTO");

class RoomDetailDTO {
  constructor(room) {
    this.MaPhong = room.MaPhong;
    this.TenPhong = room.TenPhong;
    this.SucChua = room.SucChua;
    this.SoGiuong = room.SoGiuong;
    this.GiaNgayCoBan = room.GiaNgayCB;
    this.GiaGioCoBan = room.GiaGioCB;
    this.MoTa = room.MoTa;

    // Quan hệ 1-1
    this.LoaiPhong = room.LoaiPhong ? new LoaiPhongDTO(room.LoaiPhong) : null;

    // Quan hệ 1-n
    this.TrangThaiPhong =
      room.TrangThaiPhong?.map((t) => new TrangThaiPhongDTO(t)) || [];
    this.HinhAnh = room.HinhAnh?.map((h) => new HinhAnhDTO(h)) || [];
    this.GiaPhongTuan =
      room.GiaPhongTuan?.map((g) => new GiaPhongTuanDTO(g)) || [];
    this.GiaPhongNgayLe =
      room.GiaPhongNgayLe?.map((g) => new GiaPhongNgayLeDTO(g)) || [];
    this.TienIch = room.TienIch?.map((t) => new TienIchDTO(t)) || [];
  }

  get maPhong() {
    return this.MaPhong;
  }
  get tenPhong() {
    return this.TenPhong;
  }
  get sucChua() {
    return this.SucChua;
  }
  get soGiuong() {
    return this.SoGiuong;
  }
  get giaNgayCoBan() {
    return this.GiaNgayCoBan;
  }
  get giaGioCoBan() {
    return this.GiaGioCoBan;
  }
  get moTa() {
    return this.MoTa;
  }
  get loaiPhong() {
    return this.LoaiPhong;
  }
  get trangThaiPhong() {
    return this.TrangThaiPhong;
  }
  get hinhAnh() {
    return this.HinhAnh;
  }
  get giaPhongTuan() {
    return this.GiaPhongTuan;
  }
  get giaPhongNgayLe() {
    return this.GiaPhongNgayLe;
  }
  get tienIch() {
    return this.TienIch;
  }

  // 1. Lấy giaNgay ngày hôm nay của phòng, ưu tiên giá ngày lễ, sau đó là giá theo tuần, cuối cùng là giá cơ bản
  getGiaNgayToday() {
    // Lấy ngày hiện tại và chuyển sang múi giờ GMT+7
    const now = new Date();
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Lấy thứ trong tuần (1-8, trong đó 8 là Chủ Nhật)
    const weekday = today.getDay() === 0 ? 8 : today.getDay() + 1;

    // Ưu tiên giá ngày lễ
    if (this.GiaPhongNgayLe) {
      for (const le of this.GiaPhongNgayLe) {
        const start = new Date(le.NgayBatDau);
        const end = new Date(le.NgayKetThuc);

        if (today >= start && today <= end) {
          return le.GiaNgay ?? this.GiaNgayCB;
        }
      }
    }

    // Sau đó đến giá theo tuần
    if (this.GiaPhongTuan) {
      const found = this.GiaPhongTuan.find(
        (g) => Number(g.ThuApDung) === weekday
      );
      if (found) return found.GiaNgay ?? this.GiaNgayCB;
    }

    // Không có giá đặc biệt thì dùng giá cơ bản
    return this.GiaNgayCB;
  }

  // 2. Lấy giaGio giờ hôm nay của phòng, ưu tiên giá ngày lễ, sau đó là giá theo tuần, cuối cùng là giá cơ bản
  getGiaGioToday() {
    // Lấy ngày hiện tại và chuyển sang múi giờ GMT+7
    const now = new Date();
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Lấy thứ trong tuần (1-8, trong đó 8 là Chủ Nhật)
    const weekday = today.getDay() === 0 ? 8 : today.getDay() + 1;

    // Ưu tiên giá ngày lễ
    if (this.GiaPhongNgayLe) {
      for (const le of this.GiaPhongNgayLe) {
        const start = new Date(le.NgayBatDau);
        const end = new Date(le.NgayKetThuc);

        if (today >= start && today <= end) {
          return le.GiaGio ?? this.GiaGioCB;
        }
      }
    }

    // Sau đó đến giá theo tuần
    if (this.GiaPhongTuan) {
      const found = this.GiaPhongTuan.find(
        (g) => Number(g.ThuApDung) === weekday
      );
      if (found) {
        return found.GiaGio ?? this.GiaGioCB;
      }
    }

    // Không có giá đặc biệt thì dùng giá cơ bản
    return this.GiaGioCB;
  }

  // 3. Lấy trạng thái hiện tại của phòng
  getCurrentTrangThai() {
    // Nếu không có trạng thái phòng nào thì trả về Empty
    if (!this.TrangThaiPhong && this.TrangThaiPhong.length === 0) {
      return "Empty";
    }

    // Sắp xếp trạng thái phòng theo thời gian cập nhật giảm dần và lấy trạng thái mới nhất
    const latest = this.TrangThaiPhong.sort(
      (a, b) => new Date(b.ThoiGianCapNhat) - new Date(a.ThoiGianCapNhat)
    )[0];

    // Nếu vì lý do nào đó latest bị undefined thì trả về Empty
    if (!latest || !latest.TrangThai) {
      return "Empty";
    }

    return latest.TrangThai;
  }
}

module.exports = RoomDetailDTO;
