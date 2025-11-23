module.exports = (sequelize, DataTypes) => {
  const Phong = sequelize.define(
    "Phong",
    {
      MaPhong: { type: DataTypes.STRING(4), primaryKey: true },
      TenLoaiPhong: DataTypes.STRING(50),
      TenPhong: DataTypes.STRING(255),
      SucChua: DataTypes.TINYINT,
      SoGiuong: DataTypes.TINYINT,
      GiaNgayCB: DataTypes.INTEGER,
      GiaGioCB: DataTypes.INTEGER,
    },
    { tableName: "Phong", timestamps: false }
  );

  Phong.associate = (models) => {
    Phong.belongsTo(models.LoaiPhong, { foreignKey: "TenLoaiPhong" });

    Phong.hasMany(models.HinhAnh, { foreignKey: "MaPhong" });
    Phong.hasMany(models.TrangThaiPhong, { foreignKey: "MaPhong" });
    Phong.hasMany(models.GiaPhongTuan, { foreignKey: "MaPhong" });
    Phong.hasMany(models.GiaPhongNgayLe, { foreignKey: "MaPhong" });
    Phong.hasMany(models.ChiTietDatPhong, { foreignKey: "MaPhong" });

    Phong.belongsToMany(models.TienIch, {
      through: models.Phong_TienIch,
      foreignKey: "MaPhong",
      otherKey: "TenTienIch",
    });
  };

  return Phong;
};
