module.exports = (sequelize, DataTypes) => {
  const TrangThaiPhong = sequelize.define(
    "TrangThaiPhong",
    {
      MaPhong: DataTypes.STRING(4),
      ThoiGianCapNhat: { type: DataTypes.DATE, primaryKey: true },
      TrangThai: DataTypes.STRING(20),
    },
    { tableName: "TrangThaiPhong", timestamps: false }
  );

  TrangThaiPhong.associate = (models) => {
    TrangThaiPhong.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  };

  return TrangThaiPhong;
};
