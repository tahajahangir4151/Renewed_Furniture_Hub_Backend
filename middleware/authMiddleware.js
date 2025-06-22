import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("[AUTH] Incoming Authorization Header:", authHeader);
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("[AUTH] No token provided");
    return res.status(401).json({ message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[AUTH] Decoded JWT:", decoded);

    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!req.user) {
      console.log("[AUTH] User not found for decoded token");
      return res.status(401).json({ message: "User not found" });
    }
    console.log("[AUTH] Authenticated user:", req.user.id, req.user.email);
    next();
  } catch (error) {
    console.log("[AUTH] JWT verification error:", error.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
