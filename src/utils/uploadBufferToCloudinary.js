import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = async (buffer, folder) => {
  const base64 = buffer.toString("base64");
  const dataURI = "data:image/png;base64," + base64;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: folder,
  });

  return result.secure_url;
};

module.exports = uploadBufferToCloudinary;
