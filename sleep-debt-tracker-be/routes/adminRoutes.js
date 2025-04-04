import express from "express";
import { User } from "../models/User.js";
import { SleepEntry } from "../models/SleepEntry.js";
import bcrypt from "bcryptjs";
const router = express.Router();

// get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// get user by id
router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// create user
router.post("/users", async (req, res) => {
    try {
        const { userId, name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userId,
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// delete user by id
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// see user sleep entries
router.get("/users/:id/sleepentries", async (req, res) => {
    try {
        const sleepEntries = await SleepEntry.find({
            userId: req.params.id,
        }).sort({ startTime: -1 });
        res.json(sleepEntries);
    } catch (error) {
        console.error("Error fetching sleep entries:", error);
        res.status(500).json({ message: "Server error" });
    }
});
export default router;
