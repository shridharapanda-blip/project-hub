const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true,
},

description: {
  type: String,
  required: true,
},

organizer: {
  type: String,
  required: true,
  trim: true,
},

mode: {
  type: String,
  enum: ["Online", "Offline", "Hybrid"],
  default: "Online",
},

location: {
  type: String,
  default: "",
},

registrationLink: {
  type: String,
  required: true,
},

prize: {
  type: String,
  default: "Not specified",
},

startDate: {
  type: Date,
  required: true,
},

endDate: {
  type: Date,
  required: true,
},

deadline: {
  type: Date,
  required: true,
},

image: {
  type: String,
  default: "",
},

createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},


},
{ timestamps: true }
);

hackathonSchema.index({ title: "text", description: "text", organizer: "text" });

module.exports = mongoose.model("Hackathon", hackathonSchema);
