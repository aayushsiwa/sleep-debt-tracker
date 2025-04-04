import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username/userId
        const user = await User.findOne({ userId: username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username" });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.userId, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set secure cookie with token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: "Strict"
        });

        // Send response with user info
        return res.status(200).json({
            message: "Login successful",
            userId: user.userId,
            id: user._id,
            token // Optional: including token in response body
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            message: "An error occurred during login",
            error: error.message 
        });
    }
};