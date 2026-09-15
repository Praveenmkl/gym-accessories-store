import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: "Invalid token" });
    }
};

export const authMiddleware = protect;

export const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user?.id).select("role");

        if (!user || user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        next();
    } catch {
        res.status(500).json({ msg: "Server error" });
    }
};