const { Model } = require("sequelize");

class TrangThaiPhong extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaPhong: { type: DataTypes.STRING(4), allowNull: false },
        ThoiGianCapNhat: {
          type: DataTypes.DATE,
          primaryKey: true,
          allowNull: false,
        },
        TrangThai: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "Empty",
        },
      },
      { sequelize, tableName: "TrangThaiPhong", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  }
}

module.exports = TrangThaiPhong;
