"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ===========================
    // 1. NhanVien
    // ===========================
    await queryInterface.createTable("NhanVien", {
      MaNV: { type: DataTypes.STRING(8), allowNull: false, primaryKey: true },
      HoTen: { type: DataTypes.STRING, allowNull: false },
      NgayVaoLam: { type: DataTypes.DATEONLY, allowNull: true },
      NgaySinh: { type: DataTypes.DATEONLY, allowNull: true },
      PhongBan: { type: DataTypes.STRING(50), allowNull: true },
      SDT: { type: DataTypes.STRING(15), allowNull: true },
      Email: { type: DataTypes.STRING(100), allowNull: false },
      ImgURL: { type: DataTypes.STRING(255), allowNull: true },
      TrangThai: { type: DataTypes.STRING(20), allowNull: true },
      Password: { type: DataTypes.STRING(255), allowNull: false },
    });

    // ===========================
    // 2. LoaiPhong
    // ===========================
    await queryInterface.createTable("LoaiPhong", {
      TenLoaiPhong: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      MoTa: { type: DataTypes.STRING(500), allowNull: true },
    });

    // ===========================
    // 3. Phong
    // ===========================
    await queryInterface.createTable("Phong", {
      MaPhong: {
        type: DataTypes.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      TenLoaiPhong: { type: DataTypes.STRING(50), allowNull: false },
      TenPhong: { type: DataTypes.STRING(255), allowNull: false },
      SucChua: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 1 },
      SoGiuong: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 1 },
      GiaNgayCB: { type: DataTypes.INTEGER, allowNull: false },
      GiaGioCB: { type: DataTypes.INTEGER, allowNull: false },
      MoTa: { type: DataTypes.STRING(500), allowNull: true },
    });

    // ===========================
    // 4. TrangThaiPhong
    // ===========================
    await queryInterface.createTable("TrangThaiPhong", {
      MaPhong: { type: DataTypes.STRING(4), allowNull: false },
      ThoiGianCapNhat: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false,
      },
      TrangThai: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Empty",
      },
    });

    // ===========================
    // 5. TienIch
    // ===========================
    await queryInterface.createTable("TienIch", {
      MaTienIch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      TenTienIch: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      IconURL: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      MoTa: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    });

    // ===========================
    // 6. Phong_TienIch
    // ===========================
    await queryInterface.createTable("Phong_TienIch", {
      MaPhong: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      MaTienIch: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });

    // ===========================
    // 7. KhachHang
    // ===========================
    await queryInterface.createTable("KhachHang", {
      MaKhachHang: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      HoVaTen: { type: DataTypes.STRING(100), allowNull: false },
      GioiTinh: { type: DataTypes.STRING(10), allowNull: false },
      NgaySinh: { type: DataTypes.DATEONLY, allowNull: true },
      SDT: { type: DataTypes.STRING(15), allowNull: true },
      Email: { type: DataTypes.STRING(100), allowNull: false },
    });

    // ===========================
    // 8. DatPhong
    // ===========================
    await queryInterface.createTable("DatPhong", {
      MaDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      MaKhachHang: { type: DataTypes.STRING(10), allowNull: false },
      NgayDat: { type: DataTypes.DATE, allowNull: false },
      NgayNhanPhong: { type: DataTypes.DATE, allowNull: false },
      NgayTraPhong: { type: DataTypes.DATE, allowNull: false },
    });

    // ===========================
    // 9. ChiTietDatPhong
    // ===========================
    await queryInterface.createTable("ChiTietDatPhong", {
      MaCTDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      MaDatPhong: { type: DataTypes.INTEGER, allowNull: false },
      MaPhong: { type: DataTypes.STRING(4), allowNull: false },
    });

    // ===========================
    // 10. ChiTietGiaDatPhong
    // ===========================
    await queryInterface.createTable("ChiTietGiaDatPhong", {
      MaCTGiaDatPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      MaCTDatPhong: { type: DataTypes.INTEGER, allowNull: false },
      Ngay: { type: DataTypes.DATEONLY, allowNull: false },
      GiaNgay: { type: DataTypes.INTEGER, allowNull: false },
      GiaGio: { type: DataTypes.INTEGER, allowNull: true },
      LoaiGia: { type: DataTypes.STRING(20), allowNull: false },
    });

    // ===========================
    // 11. GiaPhongNgayLe
    // ===========================
    await queryInterface.createTable("GiaPhongNgayLe", {
      MaPhong: {
        type: DataTypes.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      NgayLe: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      NgayBatDau: { type: DataTypes.DATEONLY, allowNull: false },
      NgayKetThuc: { type: DataTypes.DATEONLY, allowNull: true },
      GiaNgay: { type: DataTypes.INTEGER, allowNull: true },
      GiaGio: { type: DataTypes.INTEGER, allowNull: true },
    });

    // ===========================
    // 12. GiaPhongTuan
    // ===========================
    await queryInterface.createTable("GiaPhongTuan", {
      MaPhong: {
        type: DataTypes.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      ThuApDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      GiaNgay: { type: DataTypes.INTEGER, allowNull: true },
      GiaGio: { type: DataTypes.INTEGER, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropAllTables();
  },
};
