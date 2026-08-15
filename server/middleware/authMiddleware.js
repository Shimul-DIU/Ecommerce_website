import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    // Expected:
    // Authorization: Bearer TOKEN

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // Verify access token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export default authMiddleware;