const { verifyToken } = require("../utils/jwt");

const protect = (req, res, next) => {
  try {
    let token = null;

    // Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Fall back to Authorization header
    if (!token) {
      const header = req.headers.authorization;
      if (header && header.startsWith("Bearer ")) {
        token = header.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Access denied. Invalid or expired token.",
    });
  }
};

// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: "Access denied. You do not have permission.",
//       });
//     }
//     next();
//   };
// };
const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "SUPER_ADMIN" || roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({
      message: "Access denied. You do not have permission.",
    });
  };
};
const restrictToSuperAdmin = (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "Access denied. Super Admin only.",
    });
  }
  next();
};

module.exports = { protect, restrictTo, restrictToSuperAdmin };
