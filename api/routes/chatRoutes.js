const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

// Accessing the Chat Page.
router.post("/", protect, accessChat);
//  Accessing all the chats between the current and other user.
router.get("/", protect, fetchChats);

// Creation of group.
router.post("/group", protect, createGroupChat);

// Renaming a group chat.
router.put("/rename", protect, renameGroup);

// // Add menmber to the group.
router.put("/groupadd", protect, addToGroup);

// // Remove member from group.
router.put("/groupremove", protect, removeFromGroup);

module.exports = router;

// I have createChat with Salman + Mike for demo purposes.
