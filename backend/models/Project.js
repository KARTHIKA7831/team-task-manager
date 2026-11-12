
const mongoose = require("mongoose");

// Project Schema
const projectSchema = new mongoose.Schema(
    {
        // Project Name
        name: {
            type: String,
            required: true,
            maxlength: 60,
            trim: true
        },

        // Project Description
        description: {
            type: String,
            trim: true
        },

        // Project Owner
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Project Members
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                role: {
                    type: String,
                    enum: ["owner", "member"],
                    required: true
                }
            }
        ]
    },

    // Automatically create dates
    {
        timestamps: true
    }
);

// Create Project Model
const Project = mongoose.model("Project", projectSchema);

// Export Model
module.exports = Project;
