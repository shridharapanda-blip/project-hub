const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
recipient: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
index: true,
},
sender: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

type: {
  type: String,
  enum: [
    "project",
    "message",
    "hackathon",
    "collaboration",
    "system",
  ],
  default: "system",
},

title: {
  type: String,
  required: true,
  trim: true,
  maxlength: 150,
},

message: {
  type: String,
  required: true,
  trim: true,
  maxlength: 1000,
},

link: {
  type: String,
  default: "",
},

isRead: {
  type: Boolean,
  default: false,
},

},
{ timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
