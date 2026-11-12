const checkProjectOwner = (req, res, next) => {

    const isOwner = String(req.project.owner) === String(req.user.id);

    if (!isOwner) {
        return res.status(403).json({
            message: "Only project owner can do this"
        });
    }

    next();
};

module.exports = checkProjectOwner;