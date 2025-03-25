import express from "express";
import { SleepEntry } from "../models/SleepEntry.js";
import { User } from "../models/User.js";
import { calculateSleepDebt } from "../utils/calculateSleepDebt.js";

const router = express.Router();

// ✅ Add a new sleep entry
router.post("/add", async (req, res) => {
    try {
        let { userId, startTime, endTime } = req.body;

        startTime = Math.floor(new Date(startTime).getTime() / 1000);
        endTime = Math.floor(new Date(endTime).getTime() / 1000);

        const sleepEntry = new SleepEntry({ userId, startTime, endTime });
        await sleepEntry.save();

        res.status(201).json(sleepEntry);
    } catch (error) {
        console.error("❌ Error adding sleep entry:", error);
        res.status(500).json({ message: "Error adding sleep entry" });
    }
});

// ✅ Fetch sleep entries by userId
router.get("/:userId", async (req, res) => {
    try {
        const sleepEntries = await SleepEntry.find({
            userId: req.params.userId,
        }).sort({ startTime: -1 });

        if (!sleepEntries.length) {
            return res.status(404).json({ message: "No sleep records found" });
        }

        res.status(200).json(sleepEntries);
    } catch (error) {
        console.error("❌ Error fetching sleep entries:", error);
        res.status(500).json({ message: "Error fetching sleep entries" });
    }
});

// ✅ Fetch sleep debt per day for the past 7 days
router.get("/debt/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const sleepLogs = await SleepEntry.find({
            userId,
            startTime: { $gte: oneWeekAgo },
        });
        const sleepDebt = calculateSleepDebt(sleepLogs);

        res.json({ sleepDebt });
    } catch (error) {
        console.error("❌ Error fetching sleep debt:", error);
        res.status(500).json({ message: "Error calculating sleep debt" });
    }
});

// ✅ Update user's sleep goal
router.put("/:userId/sleep-goal", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { userId: req.params.userId },
            { sleepGoal: req.body.sleepGoal },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Sleep goal updated successfully", user });
    } catch (error) {
        console.error("❌ Error updating sleep goal:", error);
        res.status(500).json({ message: "Failed to update sleep goal" });
    }
});

// ✅ Fetch user's sleep goal
router.get("/:userId/sleep-goal", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ sleepGoal: user.sleepGoal || 480 }); // Default 8 hours (480 mins)
    } catch (error) {
        console.error("❌ Error fetching sleep goal:", error);
        res.status(500).json({ message: "Error fetching sleep goal" });
    }
});

export default router;
