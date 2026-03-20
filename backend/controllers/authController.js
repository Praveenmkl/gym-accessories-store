import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@123";

//register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

//login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// admin login
export const adminLoginUser = async (req, res) => {
    try {
        const email = (req.body?.email || "").trim().toLowerCase();
        const password = (req.body?.password || "").trim();
        let user = await User.findOne({ email });

        // Optional bootstrap: if login matches configured admin credentials and user is missing,
        // create admin user once and then continue with normal auth checks.
        const configuredEmail = ADMIN_EMAIL.trim().toLowerCase();
        const configuredPassword = ADMIN_PASSWORD.trim();
        if (!user && email === configuredEmail && password === configuredPassword) {
            const hashedPassword = await bcrypt.hash(configuredPassword, 10);
            user = await User.create({
                name: "Admin",
                email: configuredEmail,
                password: hashedPassword,
                role: "admin",
            });
        }

        if (!user || user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};