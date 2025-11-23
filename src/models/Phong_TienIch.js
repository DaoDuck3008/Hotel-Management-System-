module.exports = (sequelize, DataTypes) => {
  const Phong_TienIch = sequelize.define(
    "Phong_TienIch",
    {
      MaPhong: { type: DataTypes.STRING(4), primaryKey: true },
      TenTienIch: { type: DataTypes.STRING(50), primaryKey: true },
    },
    { tableName: "Phong_TienIch", timestamps: false }
  );

  Phong_TienIch.associate = (models) => {
    Phong_TienIch.belongsTo(models.Phong, { foreignKey: "MaPhong" });
    Phong_TienIch.belongsTo(models.TienIch, { foreignKey: "TenTienIch" });
  };

  return Phong_TienIch;
};
