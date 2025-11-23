module.exports = (sequelize, DataTypes) => {
  const NhanVien = sequelize.define(
    "NhanVien",
    {
      MaNV: { type: DataTypes.STRING(8), primaryKey: true },
      HoTen: DataTypes.STRING,
      NgayVaoLam: DataTypes.DATEONLY,
      NgaySinh: DataTypes.DATEONLY,
      PhongBan: DataTypes.STRING(50),
      SDT: DataTypes.STRING(10),
      Email: DataTypes.STRING(100),
      ImgURL: DataTypes.STRING(255),
      TrangThai: DataTypes.STRING(20),
    },
    { tableName: "NhanVien", timestamps: false }
  );

  NhanVien.associate = () => {};

  return NhanVien;
};
