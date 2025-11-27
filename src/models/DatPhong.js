const { Model } = require("sequelize");

class DatPhong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaDatPhong: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MaKhachHang: { type: DataTypes.STRING(10), allowNull: false },
        NgayDat: { type: DataTypes.DATE, allowNull: false },
        NgayNhanPhong: { type: DataTypes.DATE, allowNull: false },
        NgayTraPhong: { type: DataTypes.DATE, allowNull: false },
      },
      { sequelize, tableName: "DatPhong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.KhachHang, {
      foreignKey: "MaKhachHang",
      as: "KhachHang",
    });
    this.hasMany(models.ChiTietDatPhong, {
      foreignKey: "MaDatPhong",
      as: "ChiTiet",
    });
  }
}

module.exports = DatPhong;
