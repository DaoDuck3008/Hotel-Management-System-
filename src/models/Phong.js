const { Model } = require("sequelize");

class Phong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaPhong: {
          type: DataTypes.STRING(4),
          primaryKey: true,
          allowNull: false,
        },
        TenLoaiPhong: { type: DataTypes.STRING(50), allowNull: false },
        TenPhong: { type: DataTypes.STRING(255), allowNull: false },
        SucChua: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
        SoGiuong: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
        },
        GiaNgayCB: { type: DataTypes.INTEGER, allowNull: false },
        GiaGioCB: { type: DataTypes.INTEGER, allowNull: false },
        MoTa: { type: DataTypes.STRING(500), allowNull: true },
      },
      { sequelize, tableName: "Phong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.LoaiPhong, {
      foreignKey: "TenLoaiPhong",
      as: "LoaiPhong",
    });

    this.hasMany(models.HinhAnh, { foreignKey: "MaPhong", as: "HinhAnh" });
    this.hasMany(models.TrangThaiPhong, {
      foreignKey: "MaPhong",
      as: "TrangThaiPhong",
    });
    this.hasMany(models.GiaPhongTuan, {
      foreignKey: "MaPhong",
      as: "GiaPhongTuan",
    });
    this.hasMany(models.GiaPhongNgayLe, {
      foreignKey: "MaPhong",
      as: "GiaPhongNgayLe",
    });
    this.hasMany(models.ChiTietDatPhong, {
      foreignKey: "MaPhong",
      as: "ChiTietDatPhong",
    });

    this.belongsToMany(models.TienIch, {
      through: models.Phong_TienIch,
      foreignKey: "MaPhong",
      otherKey: "MaTienIch",
      as: "TienIch",
    });
  }

  // ----------------------------------------------------------
  // Các phương thức khác của mô hình Phong có thể được định nghĩa ở đây
  // ----------------------------------------------------------
  // 1. Lấy giaNgay ngày hôm nay của phòng, ưu tiên giá ngày lễ, sau đó là giá theo tuần, cuối cùng là giá cơ bản
  getGiaNgayToday() {
    const now = new Date();
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);

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
    const now = new Date();
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);

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
    if (!this.TrangThaiPhong && this.TrangThaiPhong.length === 0) {
      return "Empty";
    }

    const latest = this.TrangThaiPhong.sort(
      (a, b) => new Date(b.ThoiGianCapNhat) - new Date(a.ThoiGianCapNhat)
    )[0];

    // Nếu vì lý do nào đó latest vẫn undefined
    if (!latest || !latest.TrangThai) {
      return "Empty";
    }

    return latest.TrangThai;
  }
}

module.exports = Phong;
