import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sleepRoutes from "./routes/sleepRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { User } from "./models/User.js";
import { SleepEntry } from "./models/SleepEntry.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/sleep", sleepRoutes);
app.use("/api/users", userRoutes);

async function connectDB() {
  try {
      await mongoose.connect(process.env.MONGO_URI || "", {
          serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Connected to MongoDB Atlas");

      // Ensure indexes exist (doesn't drop existing ones)
      await User.syncIndexes();
      await SleepEntry.syncIndexes();
      console.log("✅ Indexes ensured for User and SleepEntry models");

      // ✅ Check if collections exist and create them if missing
      const existingCollections = (await mongoose.connection.db.listCollections().toArray()).map(col => col.name);

      if (!existingCollections.includes("users")) {
          await mongoose.connection.db.createCollection("users");
          console.log("📌 Created 'users' collection.");
      }

      if (!existingCollections.includes("sleepentries")) {
          await mongoose.connection.db.createCollection("sleepentries");
          console.log("📌 Created 'sleepentries' collection.");
      }

  } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
  }
}

connectDB();

process.on("SIGINT", async () => {
    console.log("\n🔴 Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
