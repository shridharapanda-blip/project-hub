const express = require("express");

const Project = require("../models/project");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// GET ALL PUBLIC PROJECTS
router.get("/", async (req, res) => {
    try {
        const { search, category, status } = req.query;

        const filter = {
            isPublic: true
        };

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } },
                { skills: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const projects = await Project.find(filter)
            .populate("creator", "name profilePicture college")
            .populate("members", "name profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error("Fetch projects error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch projects"
        });
    }
});

// GET ONE PROJECT
router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            isPublic: true
        })
            .populate("creator", "name profilePicture college")
            .populate("members", "name profilePicture");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to fetch project"
        });
    }
});

// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            skills,
            requiredMembers,
            image,
            githubLink,
            demoLink
        } = req.body;

        if (
            !title?.trim() ||
            !description?.trim() ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required"
            });
        }

        const allowedCategories = [
            "AI/ML",
            "Web Development",
            "Mobile Development",
            "Cybersecurity",
            "Data Science",
            "Open Source",
            "Social Impact",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project category"
            });
        }

        const parsedRequiredMembers =
            requiredMembers === undefined
                ? 3
                : Number(requiredMembers);

        if (
            !Number.isInteger(parsedRequiredMembers) ||
            parsedRequiredMembers < 1 ||
            parsedRequiredMembers > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Required members must be an integer between 1 and 100"
            });
        }

        const normalizedSkills = Array.isArray(skills)
            ? [...new Set(
                skills
                    .filter(skill => typeof skill === "string")
                    .map(skill => skill.trim())
                    .filter(Boolean)
            )]
            : [];

        const project = await Project.create({
            title: title.trim(),
            description: description.trim(),
            category,
            skills: normalizedSkills,
            requiredMembers: parsedRequiredMembers,
            image,
            githubLink,
            demoLink,
            creator: req.user._id,
            members: [req.user._id]
        });

        const populatedProject = await Project.findById(project._id)
            .populate("creator", "name profilePicture college")
            .populate("members", "name profilePicture");

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: populatedProject
        });

    } catch (error) {
        console.error("Create project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to create project"
        });
    }
});

// UPDATE OWN PROJECT
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own projects"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "skills",
            "requiredMembers",
            "status",
            "image",
            "githubLink",
            "demoLink",
            "isPublic"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                project.set(field, req.body[field]);
            }
        }

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to update project"
        });
    }
});

// DELETE OWN PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own projects"
            });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to delete project"
        });
    }
});

module.exports = router;