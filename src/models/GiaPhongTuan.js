module.exports = (sequelize, DataTypes) => {
  const GiaPhongTuan = sequelize.define(
    "GiaPhongTuan",
    {
      MaPhong: { type: DataTypes.STRING(4), primaryKey: true },
      ThuApDung: { type: DataTypes.INTEGER, primaryKey: true },
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
    },
    { tableName: "GiaPhongTuan", timestamps: false }
  );

  GiaPhongTuan.associate = (models) => {
    GiaPhongTuan.belongsTo(models.Phong, { foreignKey: "MaPhong" });
  };

  return GiaPhongTuan;
};
