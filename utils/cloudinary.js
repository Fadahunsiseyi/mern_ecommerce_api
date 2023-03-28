const cloudinary = require("cloudinary");
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const cloudinaryUploadImga = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, (result) => {
      resolve(result, { url: result.secure_url }, { resource_type: "auto" });
    });
  });
};

module.exports = cloudinaryUploadImga
