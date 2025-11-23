const { Model } = require("sequelize");

class GiaPhongNgayLe extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaPhong: {
          type: DataTypes.STRING(4),
          allowNull: false,
          primaryKey: true,
        },
        NgayLe: {
          type: DataTypes.STRING(50),
          allowNull: false,
          primaryKey: true,
        },
        NgayBatDau: { type: DataTypes.DATEONLY, allowNull: false },
        NgayKetThuc: { type: DataTypes.DATEONLY, allowNull: true },
        GiaNgay: { type: DataTypes.INTEGER, allowNull: true },
        GiaGio: { type: DataTypes.INTEGER, allowNull: true },
      },
      { sequelize, tableName: "GiaPhongNgayLe", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  }
}

module.exports = GiaPhongNgayLe;
