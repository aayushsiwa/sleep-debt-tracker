import express from "express";
import { User } from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import { register } from "../controller/auth.js";
import { login } from "../controller/auth.js";
import { logout } from "../controller/logout.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// ✅ Get current user details (protected)
router.get("/me", authMiddleware, async (req, res) => {
    try {
        res.json({ authenticated: true, userId: req.userId });
    }
    catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// ✅ Update user details (protected)
router.put("/:userId", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findOneAndUpdate({ userId: req.params.userId }, { name }, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});
export default router;
