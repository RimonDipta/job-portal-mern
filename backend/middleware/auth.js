import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Check Authorization header as a fallback.
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. User not authenticated.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid authentication token.",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id name email role",
    );

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists.",
        success: false,
      });
    }

    req.id = user._id.toString();
    req.user = user;

    next();
  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`);

    return res.status(401).json({
      message: "Unauthorized request. Session expired or token is invalid.",
      success: false,
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({
        message: "Unable to determine the authenticated user role.",
        success: false,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
        success: false,
      });
    }

    next();
  };
};
