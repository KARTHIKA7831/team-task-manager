
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");
const checkProjectAccess = require("../middleware/checkProjectAccess");
const checkProjectOwner = require("../middleware/checkProjectOwner");


// CREATE TASK - POST
router.post("/:id/tasks", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const {
            title,
            description,
            assignee,
            dueDate,
            priority,
            status
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        if (title.trim().length > 120) {
            return res.status(400).json({
                message: "Task title cannot exceed 120 characters"
            });
        }

        if (assignee) {
            const isOwner = String(req.project.owner) === String(assignee);

            const isMember = req.project.members.some(
                member => String(member.user) === String(assignee)
            );

            if (!isOwner && !isMember) {
                return res.status(400).json({
                    message: "Assignee must be a project member"
                });
            }
        }

        const allowedPriorities = ["Low", "Medium", "High"];

        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        const allowedStatuses = ["To do", "In progress", "Done"];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status"
            });
        }

        if (dueDate && Number.isNaN(Date.parse(dueDate))) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        const newTask = await Task.create({
            title: title.trim(),
            description,
            project: req.project._id,
            assignee: assignee || null,
            dueDate: dueDate || null,
            priority: priority || "Medium",
            status: status || "To do",
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET ALL TASKS - GET

router.get("/:id/tasks", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const { status, priority, assignee, search, page = 1 } = req.query;

        const query = {
            project: req.project._id
        };

        // Status filter
        if (status) {
            query.status = status;
        }

        // Priority filter
        if (priority) {
            query.priority = priority;
        }

        // Assignee filter
        if (assignee) {
            query.assignee = assignee;
        }

        // My tasks
        if (req.query.myTasks === "true") {
            query.assignee = req.user.id;
        }

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Pagination
        const limit = 20;
        const skip = (Number(page) - 1) * limit;

        const tasks = await Task.find(query)
            .populate("assignee", "name email")
            .populate("createdBy", "name email")
            .sort({ dueDate: 1 })
            .skip(skip)
            .limit(limit);
            const currentDate = new Date();

            const updatedTasks = tasks.map(task => {
    const isOverdue = task.dueDate && task.dueDate < currentDate && task.status !== "Done";

    return {
        ...task.toObject(),
        isOverdue
    };
});

        res.status(200).json({
            tasks: updatedTasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// GET SINGLE TASK - GET
router.get("/:id/tasks/:taskId", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        })
        .populate("assignee", "name email")
        .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// UPDATE FULL TASK - PUT
router.put("/:id/tasks/:taskId", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const {
            title,
            description,
            assignee,
            dueDate,
            priority,
            status
        } = req.body;

        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        if (title.trim().length > 120) {
            return res.status(400).json({
                message: "Task title cannot exceed 120 characters"
            });
        }

        if (assignee) {
            const isOwner = String(req.project.owner) === String(assignee);

            const isMember = req.project.members.some(
                member => String(member.user) === String(assignee)
            );

            if (!isOwner && !isMember) {
                return res.status(400).json({
                    message: "Assignee must be a project member"
                });
            }
        }

        const allowedPriorities = ["Low", "Medium", "High"];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        const allowedStatuses = ["To do", "In progress", "Done"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status"
            });
        }

        if (dueDate && Number.isNaN(Date.parse(dueDate))) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        task.title = title.trim();
        task.description = description || "";
        task.assignee = assignee || null;
        task.dueDate = dueDate || null;
        task.priority = priority;
        task.status = status;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// UPDATE STATUS OR ASSIGNEE - PATCH
router.patch("/:id/tasks/:taskId", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        const { status, assignee } = req.body;

        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (status === undefined && assignee === undefined) {
            return res.status(400).json({
                message: "Provide status or assignee"
            });
        }

        if (status !== undefined) {
            const allowedStatuses = ["To do", "In progress", "Done"];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid task status"
                });
            }

            task.status = status;
        }

        if (assignee !== undefined) {
            if (assignee !== null && assignee !== "") {
                const isOwner = String(req.project.owner) === String(assignee);

                const isMember = req.project.members.some(
                    member => String(member.user) === String(assignee)
                );

                if (!isOwner && !isMember) {
                    return res.status(400).json({
                        message: "Assignee must be a project member"
                    });
                }
            }

            task.assignee = assignee || null;
        }

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE TASK - DELETE (OWNER ONLY)
router.delete("/:id/tasks/:taskId", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.project._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;
