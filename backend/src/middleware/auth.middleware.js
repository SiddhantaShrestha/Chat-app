import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password"); // select everything but password
    if (!user) return res.stats(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protected route middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
