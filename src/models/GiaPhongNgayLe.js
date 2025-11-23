module.exports = (sequelize, DataTypes) => {
  const GiaPhongNgayLe = sequelize.define(
    "GiaPhongNgayLe",
    {
      MaPhong: { type: DataTypes.STRING(4), primaryKey: true },
      NgayLe: { type: DataTypes.STRING(50), primaryKey: true },
      NgayBatDau: DataTypes.DATEONLY,
      NgayKetThuc: DataTypes.DATEONLY,
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
    },
    { tableName: "GiaPhongNgayLe", timestamps: false }
  );

  GiaPhongNgayLe.associate = (models) => {
    GiaPhongNgayLe.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  };

  return GiaPhongNgayLe;
};
