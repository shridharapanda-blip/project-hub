const express = require("express");
const Hackathon = require("../models/hackathon");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// GET ALL HACKATHONS
router.get("/", async (req, res) => {
try {
const { search, mode } = req.query;
const filter = {};

if (search && search.trim()) {
  const escapedSearch = search
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  filter.$or = [
    { title: { $regex: escapedSearch, $options: "i" } },
    { description: { $regex: escapedSearch, $options: "i" } },
    { organizer: { $regex: escapedSearch, $options: "i" } },
  ];
}

if (mode) {
  filter.mode = mode;
}

const hackathons = await Hackathon.find(filter)
  .populate("createdBy", "name")
  .sort({ deadline: 1 });

res.status(200).json({
  success: true,
  count: hackathons.length,
  hackathons,
});

} catch (error) {
console.error("Fetch hackathons error:", error.message);
res.status(500).json({
success: false,
message: "Unable to fetch hackathons",
});
}
});

// CREATE HACKATHON — login required
router.post("/", authMiddleware, async (req, res) => {
try {
const {
title,
description,
organizer,
mode,
location,
registrationLink,
prize,
startDate,
endDate,
deadline,
image,
} = req.body;

if (
  !title ||
  !description ||
  !organizer ||
  !registrationLink ||
  !startDate ||
  !endDate ||
  !deadline
) {
  return res.status(400).json({
    success: false,
    message: "Please provide all required hackathon details",
  });
}

if (new Date(endDate) < new Date(startDate)) {
  return res.status(400).json({
    success: false,
    message: "End date must be on or after start date",
  });
}

const hackathon = await Hackathon.create({
  title,
  description,
  organizer,
  mode,
  location,
  registrationLink,
  prize,
  startDate,
  endDate,
  deadline,
  image,
  createdBy: req.user._id,
});

res.status(201).json({
  success: true,
  message: "Hackathon created successfully",
  hackathon,
});

} catch (error) {
console.error("Create hackathon error:", error.message);
res.status(400).json({
success: false,
message: "Unable to create hackathon. Check the provided details.",
});
}
});

// GET ONE HACKATHON
router.get("/:id", async (req, res) => {
try {
const hackathon = await Hackathon.findById(req.params.id)
.populate("createdBy", "name");


if (!hackathon) {
  return res.status(404).json({
    success: false,
    message: "Hackathon not found",
  });
}

res.status(200).json({ success: true, hackathon });

} catch (error) {
if (error.name === "CastError") {
return res.status(400).json({
success: false,
message: "Invalid hackathon ID",
});
}
res.status(500).json({
  success: false,
  message: "Unable to fetch hackathon",
});

}
});

module.exports = router;
