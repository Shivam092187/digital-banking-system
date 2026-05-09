const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model");

/**
 * 🔥 USER AUTH MIDDLEWARE
 */
async function authMiddleware(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token missing",
    });
  }

  try {
    const isBlacklisted = await tokenBlackListModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

/**
 * 🔥 SYSTEM USER MIDDLEWARE
 */
async function authSystemUserMiddleware(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token missing",
    });
  }

  try {
    const isBlacklisted = await tokenBlackListModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findById(decoded.userId)
      .select("+systemUser");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden: Not a system user",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authMiddleware,
  authSystemUserMiddleware,
};