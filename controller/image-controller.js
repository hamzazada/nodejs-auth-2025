const Image = require("../model/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const fs = require("fs");
const { sendResponse } = require("../middleware/status");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in request object
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required !",
      });
    }
    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //Store the image url and public id along with the uploaded user id
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();
    //========================
    //delete the file from local storage
    //========================

    // fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded Successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong !",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 2);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage : page,
        totalPage : totalPages,
        totalImages : totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.error("upload error", error);
    return sendResponse(res, 500, "something went Wrong!");
  }
};
// Delete Image
const deleteImageController = async (req, res) => {
  try {
    const idForImageToBeDeleted = req.params.id;
    const image_obj = await Image.findById(idForImageToBeDeleted);
    const userId = req.userInfo.userId;

    console.log(image_obj);

    if (!image_obj) {
      return sendResponse(res, 404, "image not found");
    }
    //check if the image is uploaded which trying to delete
    if (image_obj.uploadedBy.toString() !== userId) {
      return sendResponse(
        res,
        403,
        "you are not authorized to delete this image because you haven't uploaded it "
      );
    }
    //delete this image from cloudinary storage
    await cloudinary.uploader.destroy(image_obj.publicId);

    //delete this image from mongoDB database
    await Image.findByIdAndDelete(idForImageToBeDeleted);
    return sendResponse(res, 200, "image deleted Successfully");
  } catch (error) {
    console.error("Delete error", error);
    return sendResponse(res, 500, "something went Wrong!");
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
