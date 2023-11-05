const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const router = express.Router();

// fetch messages for a single chat between me and my friend.
router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

module.exports = router;
