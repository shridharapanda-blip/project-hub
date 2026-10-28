const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/message");
const User = require("../models/user");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// SEND A MESSAGE
router.post("/", authMiddleware, async (req, res) => {
try {
const { receiverId, text } = req.body;


if (!receiverId || !mongoose.isValidObjectId(receiverId)) {
  return res.status(400).json({
    success: false,
    message: "Please provide a valid receiverId",
  });
}

if (receiverId === req.user._id.toString()) {
  return res.status(400).json({
    success: false,
    message: "You cannot send a message to yourself",
  });
}

if (!text || !text.trim()) {
  return res.status(400).json({
    success: false,
    message: "Message text cannot be empty",
  });
}

const receiver = await User.findOne({
  _id: receiverId,
  isActive: true,
});

if (!receiver) {
  return res.status(404).json({
    success: false,
    message: "Receiver not found",
  });
}

const message = await Message.create({
  sender: req.user._id,
  receiver: receiver._id,
  text: text.trim(),
});

res.status(201).json({
  success: true,
  message: "Message sent successfully",
  data: message,
});


} catch (error) {
console.error("Send message error:", error.message);
res.status(500).json({
success: false,
message: "Unable to send message",
});
}
});

// GET CONVERSATION WITH A SPECIFIC USER
router.get("/:userId", authMiddleware, async (req, res) => {
try {
const { userId } = req.params;

if (!mongoose.isValidObjectId(userId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid user ID",
  });
}

if (userId === req.user._id.toString()) {
  return res.status(400).json({
    success: false,
    message: "Choose another user for a conversation",
  });
}

const otherUser = await User.findOne({
  _id: userId,
  isActive: true,
}).select("_id name profilePicture");

if (!otherUser) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

const messages = await Message.find({
  $or: [
    { sender: req.user._id, receiver: userId },
    { sender: userId, receiver: req.user._id },
  ],
})
  .sort({ createdAt: 1 })
  .limit(200)
  .populate("sender", "name profilePicture")
  .populate("receiver", "name profilePicture");

res.status(200).json({
  success: true,
  otherUser,
  count: messages.length,
  messages,
});


} catch (error) {
console.error("Fetch messages error:", error.message);
res.status(500).json({
success: false,
message: "Unable to fetch conversation",
});
}
});

module.exports = router;
