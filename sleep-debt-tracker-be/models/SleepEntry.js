import mongoose from "mongoose";

const SleepEntrySchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    startTime: { type: Number, required: true }, // Store as Unix timestamp (seconds)
    endTime: { type: Number, required: true },   // Store as Unix timestamp (seconds)
    duration: { type: Number }, // Duration in minutes
  },
  { timestamps: true }
);

// Calculate duration before saving (in minutes)
SleepEntrySchema.pre("save", function (next) {
  this.duration = (this.endTime - this.startTime) / 60; // Convert seconds to minutes
  next();
});

export const SleepEntry = mongoose.model("SleepEntry", SleepEntrySchema);
