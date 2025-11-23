module.exports = (sequelize, DataTypes) => {
  const KhachHang = sequelize.define(
    "KhachHang",
    {
      MaKhachHang: { type: DataTypes.STRING(10), primaryKey: true },
      HoVaTen: DataTypes.STRING(100),
      GioiTinh: DataTypes.STRING(10),
      NgaySinh: DataTypes.DATEONLY,
      SDT: DataTypes.STRING(10),
      Email: DataTypes.STRING(100),
    },
    { tableName: "KhachHang", timestamps: false }
  );

  KhachHang.associate = (models) => {
    KhachHang.hasMany(models.DatPhong, { foreignKey: "MaKhachHang" });
  };

  return KhachHang;
};
