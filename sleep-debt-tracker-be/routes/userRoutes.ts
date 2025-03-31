import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const router = express.Router();

// ✅ Register a new user
router.post("/register", async (req, res) => {
    try {
        let { userId, name, email, password, googleId, githubId } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Create new user
        const newUser = new User({
            userId,
            name,
            email,
            password: hashedPassword,
            googleId,
            githubId,
            sleepGoal: 480, // Default 8 hours
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// ✅ Fetch user details
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId }).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

export default router;
