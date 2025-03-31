import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true, index: true }, // ✅ Ensure Indexed
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using social login
    googleId: { type: String }, // Store Google Auth ID if using OAuth
    githubId: { type: String }, // Store GitHub Auth ID if using OAuth
    sleepGoal: { type: Number, default: 480 }, // Default to 480 minutes (8 hours)
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
