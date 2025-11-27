const { Model } = require("sequelize");

class KhachHang extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaKhachHang: {
          type: DataTypes.STRING(10),
          primaryKey: true,
          allowNull: false,
        },
        HoVaTen: { type: DataTypes.STRING(100), allowNull: false },
        GioiTinh: { type: DataTypes.STRING(10), allowNull: false },
        NgaySinh: { type: DataTypes.DATEONLY, allowNull: true },
        SDT: { type: DataTypes.STRING(15), allowNull: true },
        Email: { type: DataTypes.STRING(100), allowNull: false },
      },
      { sequelize, tableName: "KhachHang", timestamps: false }
    );
  }

  static associate(models) {
    this.hasMany(models.DatPhong, {
      foreignKey: "MaKhachHang",
      as: "DatPhong",
    });
  }
}

module.exports = KhachHang;
