
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        // Task reference
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },

        // Comment author
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Comment content
        text: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
