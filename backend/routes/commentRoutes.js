
const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");
const checkProjectAccess = require("../middleware/checkProjectAccess");


// POST - CREATE COMMENT
router.post("/:id/tasks/:taskId/comments", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const { text } = req.body;

        // Validate comment
        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        // Find task
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Create comment
        const comment = await Comment.create({
            task: task._id,
            author: req.user.id,
            text: text.trim()
        });

        await comment.populate("author", "name");

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET - ALL COMMENTS
router.get("/:id/tasks/:taskId/comments", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        // Find task
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Get comments
        const comments = await Comment.find({
            task: task._id
        })
        .populate("author", "name")
        .sort({ createdAt: 1 });

        res.status(200).json({
            comments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE - COMMENT (ONLY AUTHOR)
router.delete("/:id/tasks/:taskId/comments/:commentId", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        // Find task
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Find comment
        const comment = await Comment.findOne({
            _id: req.params.commentId,
            task: task._id
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Check comment author
        if (String(comment.author) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Only comment author can delete this comment"
            });
        }

        // Delete comment
        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;
