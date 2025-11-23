const { Model } = require("sequelize");

class ChiTietGiaDatPhong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaCTGiaDatPhong: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MaCTDatPhong: { type: DataTypes.INTEGER, allowNull: false },
        Ngay: { type: DataTypes.DATEONLY, allowNull: false },
        GiaNgay: { type: DataTypes.INTEGER, allowNull: false },
        GiaGio: { type: DataTypes.INTEGER, allowNull: true },
        LoaiGia: { type: DataTypes.STRING(20), allowNull: false },
      },
      { sequelize, tableName: "ChiTietGiaDatPhong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.ChiTietDatPhong, { foreignKey: "MaCTDatPhong" });
  }
}

module.exports = ChiTietGiaDatPhong;
