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
      },
      { sequelize, tableName: "Phong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.LoaiPhong, { foreignKey: "TenLoaiPhong" });

    this.hasMany(models.HinhAnh, { foreignKey: "MaPhong" });
    this.hasMany(models.TrangThaiPhong, { foreignKey: "MaPhong" });
    this.hasMany(models.GiaPhongTuan, { foreignKey: "MaPhong" });
    this.hasMany(models.GiaPhongNgayLe, { foreignKey: "MaPhong" });
    this.hasMany(models.ChiTietDatPhong, { foreignKey: "MaPhong" });

    this.belongsToMany(models.TienIch, {
      through: models.Phong_TienIch,
      foreignKey: "MaPhong",
      otherKey: "TenTienIch",
    });
  }
}

module.exports = Phong;
