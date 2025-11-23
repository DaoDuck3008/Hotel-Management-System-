const { Model } = require("sequelize");

class GiaPhongTuan extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaPhong: {
          type: DataTypes.STRING(4),
          allowNull: false,
          primaryKey: true,
        },
        ThuApDung: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        GiaNgay: { type: DataTypes.INTEGER, allowNull: true },
        GiaGio: { type: DataTypes.INTEGER, allowNull: true },
      },
      { sequelize, tableName: "GiaPhongTuan", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  }
}

module.exports = GiaPhongTuan;
