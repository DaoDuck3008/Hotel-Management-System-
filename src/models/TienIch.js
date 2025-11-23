module.exports = (sequelize, DataTypes) => {
  const TienIch = sequelize.define(
    "TienIch",
    {
      TenTienIch: { type: DataTypes.STRING(50), primaryKey: true },
      IconURL: DataTypes.STRING(255),
      MoTa: DataTypes.STRING(255),
    },
    { tableName: "TienIch", timestamps: false }
  );

  TienIch.associate = (models) => {
    TienIch.belongsToMany(models.Phong, {
      through: models.Phong_TienIch,
      foreignKey: "TenTienIch",
      otherKey: "MaPhong",
    });
  };

  return TienIch;
};
