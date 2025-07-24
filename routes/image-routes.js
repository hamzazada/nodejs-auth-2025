const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const imageMiddleware = require("../middleware/image-middleware");
const { uploadImageController , fetchImageController, deleteImageController} = require("../controller/image-controller");

const router = express.Router();
// ======================
// upload images
// ======================
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  imageMiddleware.single("image"),
  uploadImageController
);
// ======================
// To get all images
// ======================

router.get('/get', authMiddleware , fetchImageController)

// ======================
// Delete image route
// ======================
router.delete('/:id',authMiddleware, adminMiddleware , deleteImageController)


module.exports = router;


