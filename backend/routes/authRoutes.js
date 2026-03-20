import express from "express";
import { registerUser, loginUser, adminLoginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLoginUser);

export default router;