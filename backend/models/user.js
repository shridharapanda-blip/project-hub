const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        profilePicture: {
            type: String,
            default: ""
        },

        coverImage: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "",
            maxlength: 500
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

        role: {
            type: String,
            enum: ["student", "mentor", "admin"],
            default: "student"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);