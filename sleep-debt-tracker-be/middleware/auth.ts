import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // console.log("Cookies received:", req.cookies); // Check if token exists
  try {
      const token = req.cookies.token;
      if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Log the decoded token for debugging
      req.userId = decoded.userId; // Attach user info to request object
      next();
  } catch (error) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
