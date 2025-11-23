const { Model } = require("sequelize");

class LoaiPhong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        TenLoaiPhong: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          allowNull: false,
        },
        MoTa: { type: DataTypes.STRING(500), allowNull: true },
      },
      { sequelize, tableName: "LoaiPhong", timestamps: false }
    );
  }

  static associate(models) {
    this.hasMany(models.Phong, { foreignKey: "TenLoaiPhong" });
  }
}

module.exports = LoaiPhong;
