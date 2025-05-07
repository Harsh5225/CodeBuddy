export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.userInfo || req.userInfo.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You are not allowed to access this resource.",
      });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    return res.status(500).json({
      message: "Internal server error in admin middleware",
    });
  }
};
