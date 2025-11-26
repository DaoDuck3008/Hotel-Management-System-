import DatPhongDAO from "../DAO/DatPhongDAO.js";

// Trang chính - hiển thị danh sách phòng và trạng thái
const index = async (req, res) => {
  try {
    const rooms = await DatPhongDAO.getAllRoomsWithStatus();
    const stats = await DatPhongDAO.getRoomStatusStatistics();

    return res.render("LeTan/index.ejs", { rooms, stats });
  } catch (error) {
    console.error("Error in reception index:", error);
    req.flash("error", "Có lỗi xảy ra khi tải dữ liệu");
    return res.redirect("/");
  }
};

// Cập nhật trạng thái phòng
const updateStatus = async (req, res) => {
  try {
    const { maPhong } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Empty", "Occupied", "Cleaning"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const result = await DatPhongDAO.updateRoomStatus(maPhong, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating room status:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật trạng thái",
    });
  }
};

module.exports = {
  index,
  updateStatus,
};
