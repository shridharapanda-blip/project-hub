const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        bio: {
            type: String,
            default: ""
        },

        profilePicture: {
            type: String,
            default: ""
        },

        college: {
            type: String,
            default: ""
        },

        branch: {
            type: String,
            default: ""
        },

        year: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        github: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

memberSchema.index({
    name: "text",
    bio: "text",
    skills: "text",
    interests: "text"
});

module.exports = mongoose.model("Member", memberSchema);