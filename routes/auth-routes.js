const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controller/auth-controller");
const authMiddleware = require('../middleware/auth-middleware')

// All routes are related to authentication and authorization

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/password", authMiddleware, changePassword);

module.exports = router;
