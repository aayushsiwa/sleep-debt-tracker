import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sleepRoutes from "./routes/sleepRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/sleep", sleepRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((error) => console.error("❌ MongoDB connection error:", error));

process.on("SIGINT", async () => {
    console.log("\n🔴 Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
