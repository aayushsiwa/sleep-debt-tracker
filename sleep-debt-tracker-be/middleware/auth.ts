import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                message: "Unauthorized: No token provided",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is not defined in environment variables"
            );
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log the decoded token for debugging
        if (typeof decoded === "object" && "userId" in decoded) {
            req.userId = decoded.userId; // Attach user info to request object
        } else {
            throw new Error("Invalid token payload");
        }
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};
