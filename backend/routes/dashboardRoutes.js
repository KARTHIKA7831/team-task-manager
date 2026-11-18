
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Project = require("../models/Project");

const authMiddleware = require("../middleware/authMiddleware");
const checkProjectAccess = require("../middleware/checkProjectAccess");
const checkProjectOwner = require("../middleware/checkProjectOwner");


// GET PROJECT DASHBOARD
router.get("/:id/dashboard", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {

        // Get project members
        const project = await Project.findById(req.project._id)
            .populate("members.user", "name email");

        // Count To do tasks
        const todoCount = await Task.countDocuments({
            project: req.project._id,
            status: "To do"
        });

        // Count In progress tasks
        const inProgressCount = await Task.countDocuments({
            project: req.project._id,
            status: "In progress"
        });

        // Count Done tasks
        const doneCount = await Task.countDocuments({
            project: req.project._id,
            status: "Done"
        });

        // Count Overdue tasks
        const overdueCount = await Task.countDocuments({
            project: req.project._id,
            dueDate: { $lt: new Date() },
            status: { $ne: "Done" }
        });

        // Count open tasks for each member
        const memberTasks = await Task.aggregate([
            {
                $match: {
                    project: req.project._id,
                    status: { $ne: "Done" },
                    assignee: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$assignee",
                    openTasks: { $sum: 1 }
                }
            }
        ]);

        // Add member names and task counts
        const openTasksPerMember = project.members.map(member => {

            const user = member.user;

            const taskData = memberTasks.find(
                item => String(item._id) === String(user._id)
            );

            return {
                userId: user._id,
                name: user.name,
                role: member.role,
                openTasks: taskData ? taskData.openTasks : 0
            };
        });

        // Send dashboard response
        res.status(200).json({
            message: "Dashboard fetched successfully",

            dashboard: {
                todoCount,
                inProgressCount,
                doneCount,
                overdueCount,
                openTasksPerMember
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;
