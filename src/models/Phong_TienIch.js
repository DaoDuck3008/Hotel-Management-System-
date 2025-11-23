const { Model } = require("sequelize");

class Phong_TienIch extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaPhong: {
          type: DataTypes.STRING(4),
          allowNull: false,
          primaryKey: true,
        },
        TenTienIch: {
          type: DataTypes.STRING(50),
          allowNull: false,
          primaryKey: true,
        },
      },
      { sequelize, tableName: "Phong_TienIch", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
    this.belongsTo(models.TienIch, { foreignKey: "TenTienIch" });
  }
}

module.exports = Phong_TienIch;
