const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// PROTECT
// ===============================
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ); 

    const user = await User.findByPk(decoded.id);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "User not found",
  });
}

if (!user.is_active) {
  return res.status(403).json({
    success: false,
    message: "Your account has been deactivated",
  });
}

req.user = user;
next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ===============================
// AUTHORIZE BY ROLE
// ===============================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

// ===============================
// EMPLOYER ONLY
// ===============================
const employerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "EMPLOYER") {
    return res.status(403).json({
      success: false,
      message: "Employer access required",
    });
  }

  next();
};

// ===============================
// ADMIN ONLY
// ===============================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  protect,
  authorize,
  employerOnly,
  adminOnly,
};