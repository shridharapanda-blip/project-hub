const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },

        category: {
            type: String,
            required: true,
            enum: [
                "AI/ML",
                "Web Development",
                "Mobile Development",
                "Cybersecurity",
                "Data Science",
                "Open Source",
                "Social Impact",
                "Other"
            ]
        },

        skills: {
            type: [String],
            default: []
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        requiredMembers: {
            type: Number,
            default: 3,
            min: 1,
            max: 100
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Completed"],
            default: "Open"
        },

        image: {
            type: String,
            default: ""
        },

        githubLink: {
            type: String,
            default: ""
        },

        demoLink: {
            type: String,
            default: ""
        },

        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        isPublic: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

projectSchema.index({
    title: "text",
    description: "text",
    skills: "text"
});

module.exports = mongoose.model("Project", projectSchema);