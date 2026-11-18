
const Project = require("../models/Project");

const checkProjectAccess = async (req, res, next) => {
    try {

        // 1. Get project ID from URL
        const projectId = req.params.id;

        // 2. Find project in MongoDB
        const project = await Project.findById(projectId);

        // 3. Check whether project exists
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // 4. Check whether logged-in user is a member
        const isMember = project.members.some(
            member => String(member.user) === String(req.user.id)
        );

        // 5. Reject if user is not a member
        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        // 6. Store project details in request
        req.project = project;

        // 7. Allow next route
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = checkProjectAccess;
