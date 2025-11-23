module.exports = (sequelize, DataTypes) => {
  const ChiTietDatPhong = sequelize.define(
    "ChiTietDatPhong",
    {
      MaCTDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaDatPhong: DataTypes.INTEGER,
      MaPhong: DataTypes.STRING(4),
    },
    { tableName: "ChiTietDatPhong", timestamps: false }
  );

  ChiTietDatPhong.associate = (models) => {
    ChiTietDatPhong.belongsTo(models.DatPhong, { foreignKey: "MaDatPhong" });
    ChiTietDatPhong.belongsTo(models.Phong, { foreignKey: "MaPhong" });

    ChiTietDatPhong.hasMany(models.ChiTietGiaDatPhong, {
      foreignKey: "MaCTDatPhong",
    });
  };

  return ChiTietDatPhong;
};
