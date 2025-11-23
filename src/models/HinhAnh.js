const { Model } = require("sequelize");

class HinhAnh extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaHinhAnh: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MaPhong: { type: DataTypes.STRING(4), allowNull: false },
        ImgURL: { type: DataTypes.STRING(255), allowNull: false },
      },
      { sequelize, tableName: "HinhAnh", timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  }
}

module.exports = HinhAnh;
