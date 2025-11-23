module.exports = (sequelize, DataTypes) => {
  const HinhAnh = sequelize.define(
    "HinhAnh",
    {
      MaHinhAnh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaPhong: DataTypes.STRING(4),
      ImgURL: DataTypes.STRING(255),
    },
    { tableName: "HinhAnh", timestamps: false }
  );

  HinhAnh.associate = (models) => {
    HinhAnh.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  };

  return HinhAnh;
};
