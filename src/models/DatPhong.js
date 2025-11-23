module.exports = (sequelize, DataTypes) => {
  const DatPhong = sequelize.define(
    "DatPhong",
    {
      MaDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaKhachHang: DataTypes.STRING(10),
      NgayDat: DataTypes.DATE,
      NgayNhanPhong: DataTypes.DATE,
      NgayTraPhong: DataTypes.DATE,
    },
    { tableName: "DatPhong", timestamps: false }
  );

  DatPhong.associate = (models) => {
    DatPhong.belongsTo(models.KhachHang, { foreignKey: "MaKhachHang" });
    DatPhong.hasMany(models.ChiTietDatPhong, { foreignKey: "MaDatPhong" });
  };

  return DatPhong;
};
