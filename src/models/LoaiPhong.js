module.exports = (sequelize, DataTypes) => {
  const LoaiPhong = sequelize.define(
    "LoaiPhong",
    {
      TenLoaiPhong: { type: DataTypes.STRING(50), primaryKey: true },
      MoTa: DataTypes.STRING(500),
    },
    { tableName: "LoaiPhong", timestamps: false }
  );

  LoaiPhong.associate = (models) => {
    LoaiPhong.hasMany(models.Phong, { foreignKey: "TenLoaiPhong" });
  };

  return LoaiPhong;
};
