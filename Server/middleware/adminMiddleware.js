const adminMiddleware = (req, res, next) => {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        // User is admin
        next();

    } catch (error) {
        console.error(
            "Admin Middleware Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Authorization error",
        });
    }
};

module.exports = adminMiddleware;