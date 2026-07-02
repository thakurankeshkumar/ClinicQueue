export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log("User Role:", req.user.role);
            console.log("Allowed Roles:", roles);
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }
        next();
    };
};