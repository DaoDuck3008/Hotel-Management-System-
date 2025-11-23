"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // 1. NhanVien
    await queryInterface.createTable("NhanVien", {
      MaNV: { type: DataTypes.STRING(8), primaryKey: true },
      HoTen: DataTypes.STRING,
      NgayVaoLam: DataTypes.DATEONLY,
      NgaySinh: DataTypes.DATEONLY,
      PhongBan: DataTypes.STRING(50),
      SDT: DataTypes.STRING(10),
      Email: DataTypes.STRING(100),
      ImgURL: DataTypes.STRING(255),
      TrangThai: DataTypes.STRING(20), // ENUM converted → string
    });

    // 2. LoaiPhong
    await queryInterface.createTable("LoaiPhong", {
      TenLoaiPhong: { type: DataTypes.STRING(50), primaryKey: true },
      MoTa: DataTypes.STRING(500),
    });

    // 3. KhachHang
    await queryInterface.createTable("KhachHang", {
      MaKhachHang: { type: DataTypes.STRING(10), primaryKey: true },
      HoVaTen: DataTypes.STRING(100),
      GioiTinh: DataTypes.STRING(10),
      NgaySinh: DataTypes.DATEONLY,
      SDT: DataTypes.STRING(10),
      Email: DataTypes.STRING(100),
    });

    // 4. Phong
    await queryInterface.createTable("Phong", {
      MaPhong: { type: DataTypes.STRING(4), primaryKey: true },
      TenLoaiPhong: { type: DataTypes.STRING(50) },
      TenPhong: DataTypes.STRING(255),
      SucChua: DataTypes.TINYINT,
      SoGiuong: DataTypes.TINYINT,
      GiaNgayCB: DataTypes.INTEGER,
      GiaGioCB: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Phong", {
      fields: ["TenLoaiPhong"],
      type: "foreign key",
      name: "fk_phong_loaiphong",
      references: { table: "LoaiPhong", field: "TenLoaiPhong" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // 5. TrangThaiPhong
    await queryInterface.createTable("TrangThaiPhong", {
      MaPhong: { type: DataTypes.STRING(4) },
      ThoiGianCapNhat: { type: DataTypes.DATE },
      TrangThai: DataTypes.STRING(20),
    });

    await queryInterface.addConstraint("TrangThaiPhong", {
      fields: ["MaPhong", "ThoiGianCapNhat"],
      type: "primary key",
      name: "pk_ttp",
    });

    await queryInterface.addConstraint("TrangThaiPhong", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_ttp_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 6. GiaPhongTuan
    await queryInterface.createTable("GiaPhongTuan", {
      MaPhong: DataTypes.STRING(4),
      ThuApDung: DataTypes.INTEGER,
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("GiaPhongTuan", {
      fields: ["MaPhong", "ThuApDung"],
      type: "primary key",
      name: "pk_gpt",
    });

    await queryInterface.addConstraint("GiaPhongTuan", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_gpt_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 7. GiaPhongNgayLe
    await queryInterface.createTable("GiaPhongNgayLe", {
      MaPhong: DataTypes.STRING(4),
      NgayLe: DataTypes.STRING(50),
      NgayBatDau: DataTypes.DATEONLY,
      NgayKetThuc: DataTypes.DATEONLY,
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("GiaPhongNgayLe", {
      fields: ["MaPhong", "NgayLe"],
      type: "primary key",
      name: "pk_gpnl",
    });

    await queryInterface.addConstraint("GiaPhongNgayLe", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_gpnl_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 8. TienIch
    await queryInterface.createTable("TienIch", {
      TenTienIch: { type: DataTypes.STRING(50), primaryKey: true },
      IconURL: DataTypes.STRING(255),
      MoTa: DataTypes.STRING(255),
    });

    // 9. Phong_TienIch
    await queryInterface.createTable("Phong_TienIch", {
      MaPhong: DataTypes.STRING(4),
      TenTienIch: DataTypes.STRING(50),
    });

    await queryInterface.addConstraint("Phong_TienIch", {
      fields: ["MaPhong", "TenTienIch"],
      type: "primary key",
      name: "pk_phong_tienich",
    });

    await queryInterface.addConstraint("Phong_TienIch", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_pti_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Phong_TienIch", {
      fields: ["TenTienIch"],
      type: "foreign key",
      name: "fk_pti_tienich",
      references: { table: "TienIch", field: "TenTienIch" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // 10. HinhAnh
    await queryInterface.createTable("HinhAnh", {
      MaHinhAnh: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaPhong: DataTypes.STRING(4),
      ImgURL: DataTypes.STRING(255),
    });

    await queryInterface.addConstraint("HinhAnh", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_hinhanh_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 11. DatPhong
    await queryInterface.createTable("DatPhong", {
      MaDatPhong: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaKhachHang: DataTypes.STRING(10),
      NgayDat: DataTypes.DATE,
      NgayNhanPhong: DataTypes.DATE,
      NgayTraPhong: DataTypes.DATE,
    });

    await queryInterface.addConstraint("DatPhong", {
      fields: ["MaKhachHang"],
      type: "foreign key",
      name: "fk_datphong_khachhang",
      references: { table: "KhachHang", field: "MaKhachHang" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // 12. ChiTietDatPhong
    await queryInterface.createTable("ChiTietDatPhong", {
      MaCTDatPhong: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaDatPhong: DataTypes.INTEGER,
      MaPhong: DataTypes.STRING(4),
    });

    await queryInterface.addConstraint("ChiTietDatPhong", {
      fields: ["MaDatPhong"],
      type: "foreign key",
      name: "fk_ctdp_datphong",
      references: { table: "DatPhong", field: "MaDatPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("ChiTietDatPhong", {
      fields: ["MaPhong"],
      type: "foreign key",
      name: "fk_ctdp_phong",
      references: { table: "Phong", field: "MaPhong" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // 13. ChiTietGiaDatPhong
    await queryInterface.createTable("ChiTietGiaDatPhong", {
      MaCTGiaDatPhong: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaCTDatPhong: DataTypes.INTEGER,
      Ngay: DataTypes.DATEONLY,
      GiaNgay: DataTypes.INTEGER,
      GiaGio: DataTypes.INTEGER,
      LoaiGia: DataTypes.STRING(20),
    });

    await queryInterface.addConstraint("ChiTietGiaDatPhong", {
      fields: ["MaCTDatPhong"],
      type: "foreign key",
      name: "fk_ctgdp_ctdp",
      references: { table: "ChiTietDatPhong", field: "MaCTDatPhong" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ChiTietGiaDatPhong");
    await queryInterface.dropTable("ChiTietDatPhong");
    await queryInterface.dropTable("DatPhong");
    await queryInterface.dropTable("HinhAnh");
    await queryInterface.dropTable("Phong_TienIch");
    await queryInterface.dropTable("TienIch");
    await queryInterface.dropTable("GiaPhongNgayLe");
    await queryInterface.dropTable("GiaPhongTuan");
    await queryInterface.dropTable("TrangThaiPhong");
    await queryInterface.dropTable("Phong");
    await queryInterface.dropTable("KhachHang");
    await queryInterface.dropTable("LoaiPhong");
    await queryInterface.dropTable("NhanVien");
  },
};
