const { Model } = require("sequelize");

class ChiTietDatPhong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaCTDatPhong: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MaDatPhong: { type: DataTypes.INTEGER, allowNull: false },
        MaPhong: { type: DataTypes.STRING(4), allowNull: false },
      },
      { sequelize, tableName: "ChiTietDatPhong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.DatPhong, { foreignKey: "MaDatPhong" });
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
    this.hasMany(models.ChiTietGiaDatPhong, {
      foreignKey: "MaCTDatPhong",
      as: "ChiTietGiaDatPhong",
    });
  }
}

module.exports = ChiTietDatPhong;
