
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        // Task Title
        title: {
            type: String,
            required: true,
            maxlength: 120,
            trim: true
        },

        // Task Description
        description: {
            type: String,
            trim: true
        },

        // Which project this task belongs to
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        // Person assigned to this task
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // Task Due Date
        dueDate: {
            type: Date,
            default: null
        },

        // Task Priority
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        // Task Status
        status: {
            type: String,
            enum: ["To do", "In progress", "Done"],
            default: "To do"
        },

        // Who created the task
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
