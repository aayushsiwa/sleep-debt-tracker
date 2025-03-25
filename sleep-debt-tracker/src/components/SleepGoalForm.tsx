import { useState, useEffect } from "react";
import { updateSleepGoal } from "../api";

export default function SleepGoalForm({ userId, currentGoal, onGoalChange }) {
  const [sleepGoal, setSleepGoal] = useState(currentGoal ?? ""); // Ensure it's never null

  // ✅ Sync state when currentGoal updates
  useEffect(() => {
    setSleepGoal(currentGoal ?? ""); // Update state when prop changes
  }, [currentGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User ID missing");

    await updateSleepGoal(userId, sleepGoal);
    onGoalChange(sleepGoal);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-lg text-white">Set Your Sleep Goal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          className="w-full bg-gray-700 p-2 rounded text-white"
          value={sleepGoal}
          onChange={(e) => setSleepGoal(e.target.value)}
          min="1"
          max="24"
        />
        <button type="submit" className="mt-4 bg-blue-500 px-4 py-2 rounded">
          Save Goal
        </button>
      </form>
    </div>
  );
}
