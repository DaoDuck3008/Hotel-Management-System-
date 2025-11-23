module.exports = (sequelize, DataTypes) => {
  const ChiTietGiaDatPhong = sequelize.define(
    "ChiTietGiaDatPhong",
    {
      MaCTGiaDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaCTDatPhong: DataTypes.INTEGER,
      Ngay: DataTypes.DATEONLY,
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
      LoaiGia: DataTypes.STRING(20),
    },
    { tableName: "ChiTietGiaDatPhong", timestamps: false }
  );

  ChiTietGiaDatPhong.associate = (models) => {
    ChiTietGiaDatPhong.belongsTo(models.ChiTietDatPhong, {
      foreignKey: "MaCTDatPhong",
    });
  };

  return ChiTietGiaDatPhong;
};
