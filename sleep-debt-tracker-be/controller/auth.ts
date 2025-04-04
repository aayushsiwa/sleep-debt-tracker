import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();
const salt = 10;

export const register = async (req, res) => {
    try {
        const { userId, name, email, password, sleepGoal } = req.body;

        if (!userId || !name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hashPassword = await bcrypt.hash(password, salt);

        const userData = {
            userId: userId,
            name: name,
            email: email,
            password: hashPassword,
            sleepGoal: sleepGoal || 480, // Default to 8 hours if not provided
        };

        const user = await User.create(userData);

        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res
            .status(200)
            .json({
                message: "User registered successfully",
                id: user._id,
                userId: user.userId,
            });
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.userId) {
                return res
                    .status(422)
                    .json({ message: "User ID already exists" });
            } else if (error.keyPattern.email) {
                return res
                    .status(422)
                    .json({ message: "Email already exists" });
            }
            return res.status(422).json({ message: "Duplicate field error" });
        }
        return res
            .status(500)
            .json({ message: "Failed to create user", error: error.message });
    }
};

export const login = async (req, res) => {
  // console.log("Login request received:", req.body); // Log the request body for debugging
    try {
        const { userId, password } = req.body;

        const user = await User.findOne({ userId: userId });

        if (!user) {
            return res.status(401).json({ message: "Invalid User ID" });
        }

        if (!user.password) {
            return res
                .status(401)
                .json({ message: "This account requires social login" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res
            .status(200)
            .json({ message: "Login successful", userId: user.userId });
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Error processing login request",
                error: error.message,
            });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    return res.status(200).json({ message: "Logout successful" });
};
