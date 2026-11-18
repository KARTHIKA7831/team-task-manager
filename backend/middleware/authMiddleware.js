const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {

        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check token availability and format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // 3. Extract token
        const token = authHeader.split(" ")[1];

        // 4. Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 5. Store user ID in request
        req.user = decoded;

        // 6. Allow next process
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;