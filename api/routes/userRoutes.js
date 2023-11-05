const express = require("express");
const router = express.Router();

const User = require("../models/User");
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");

// Registering Users.
router.route("/").post(registerUser);

// Login User.
router.post("/login", authUser);
router.get("/", protect, getAllUsers);

module.exports = router;
