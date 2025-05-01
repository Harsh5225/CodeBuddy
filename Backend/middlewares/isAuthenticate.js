export const isAuthenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
    req.id = decoded.id;
    next();
  } catch (error) {
    console.error("Error in isAuthenticate middleware:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error,authentication-problem" });
  }
};
