import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
// ✅ User Signup
export const register = async (req, res) => {
    try {
        const { userId, name, email, password, sleepGoal } = req.body;
        if (!userId || !name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            userId,
            name,
            email,
            password: hashedPassword,
            sleepGoal: sleepGoal || 480, // Default to 8 hours
        });
        const token = jwt.sign({ id: user.userId }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ token, user });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
