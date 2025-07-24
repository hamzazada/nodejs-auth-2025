const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  try {
    console.log("Uploading file:", filePath); 

    const result = await cloudinary.uploader.upload(filePath);
    console.log("Cloudinary response:", result); 

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Error while uploading to cloudinary:", error); // 🔍 Show full error
    throw new Error("Error while uploading to cloudinary");
  }
};

module.exports = {
  uploadToCloudinary
};
