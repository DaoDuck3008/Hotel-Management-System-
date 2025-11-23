const { Model } = require("sequelize");

class NhanVien extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        MaNV: { type: DataTypes.STRING(8), primaryKey: true, allowNull: false },
        HoTen: { type: DataTypes.STRING, allowNull: false },
        NgayVaoLam: { type: DataTypes.DATEONLY, allowNull: true },
        NgaySinh: { type: DataTypes.DATEONLY, allowNull: true },
        PhongBan: { type: DataTypes.STRING(50), allowNull: true },
        SDT: { type: DataTypes.STRING(15), allowNull: true },
        Email: { type: DataTypes.STRING(100), allowNull: false },
        ImgURL: { type: DataTypes.STRING(255), allowNull: true },
        TrangThai: { type: DataTypes.STRING(20), allowNull: true },
        Password: { type: DataTypes.STRING(255), allowNull: false },
      },
      { sequelize, tableName: "NhanVien", timestamps: false }
    );
  }

  static associate(models) {}
}

module.exports = NhanVien;
