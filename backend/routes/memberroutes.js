const express = require("express");

const Member = require("../models/member");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// GET ALL MEMBERS
router.get("/", async (req, res) => {
    try {
        const { search, branch, skill, college } = req.query;

        const filter = {};

        if (branch) {
            filter.branch = branch;
        }

        if (college) {
            filter.college = college;
        }

        if (skill) {
            filter.skills = {
                $regex: skill.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i"
            };
        }

        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { bio: { $regex: escapedSearch, $options: "i" } },
                { skills: { $regex: escapedSearch, $options: "i" } },
                { interests: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const members = await Member.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: members.length,
            members
        });

    } catch (error) {
        console.error("Fetch members error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch members"
        });
    }
});

// GET MY MEMBER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const member = await Member.findOne({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            member
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch your member profile"
        });
    }
});

// CREATE OR UPDATE MY MEMBER PROFILE
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const {
            bio,
            profilePicture,
            college,
            branch,
            year,
            skills,
            interests,
            github,
            linkedin
        } = req.body;

        const fields = {
            bio,
            profilePicture,
            college,
            branch,
            year,
            skills,
            interests,
            github,
            linkedin
        };

        const update = {};

        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                update[key] = value;
            }
        }

        // Use the registered account's name.
        update.name = req.user.name;

        const member = await Member.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: update,
                $setOnInsert: { user: req.user._id }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Member profile saved successfully",
            member
        });

    } catch (error) {
        console.error("Save member profile error:", error.message);

        res.status(400).json({
            success: false,
            message: "Unable to save member profile"
        });
    }
});

// GET A MEMBER BY ID
router.get("/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id)
            .populate("user", "name email");

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        res.status(200).json({
            success: true,
            member
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid member ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to fetch member"
        });
    }
});

module.exports = router;