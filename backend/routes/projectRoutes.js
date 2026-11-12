const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const checkProjectAccess = require("../middleware/checkProjectAccess");
const checkProjectOwner = require("../middleware/checkProjectOwner");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        if (name.trim().length > 60) {
            return res.status(400).json({
                message: "Name cannot exceed 60 characters"
            });
        }

        const newProject = new Project({
            name: name.trim(),
            description,
            owner: req.user.id,
            members: [
                {
                    user: req.user.id,
                    role: "owner"
                }
            ]
        });

        await newProject.save();

        res.status(201).json({
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {

        const projects = await Project.find({
            "members.user": req.user.id
        });

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/:id", authMiddleware, checkProjectAccess, async (req, res) => {
    try {
        res.status(200).json({
            project: req.project
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.put("/:id", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {
        const { name, description } = req.body;

        req.project.name = name;
        req.project.description = description;

        await req.project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project: req.project
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.delete("/:id", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {
        await req.project.deleteOne();

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/:id/members", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const alreadyMember = req.project.members.some(
    member => String(member.user) === String(user._id)
);

if (alreadyMember) {
    return res.status(400).json({
        message: "User is already a member"
    });
}

        req.project.members.push({
            user: user._id,
            role: "member"
        });

        await req.project.save();

        res.status(200).json({
            message: "Member added successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.delete("/:id/members/:userId", authMiddleware, checkProjectAccess, checkProjectOwner, async (req, res) => {
    try {
        req.project.members = req.project.members.filter(
            member => String(member.user) !== req.params.userId
        );

        await req.project.save();

        res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;