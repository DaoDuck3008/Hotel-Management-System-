const { Model } = require("sequelize");

class TienIch extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaTienIch: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        TenTienIch: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        IconURL: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        MoTa: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "TienIch",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Phong, {
      through: models.Phong_TienIch,
      foreignKey: "MaTienIch",
    });
  }
}

module.exports = TienIch;
