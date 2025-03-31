import { useState, useEffect } from "react";
import { Moon, CheckCircle } from "lucide-react";
import { updateSleepGoal } from "../api";

interface SleepGoalFormProps {
    userId: string;
    currentGoal?: number;
    onGoalChange: (goal: number) => void;
}

export default function SleepGoalForm({
    userId,
    currentGoal,
    onGoalChange,
}: SleepGoalFormProps) {
    const [sleepGoal, setSleepGoal] = useState(currentGoal ?? 8);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setSleepGoal(currentGoal ?? 8);
    }, [currentGoal]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) return alert("User ID missing");

        try {
            setIsSubmitting(true);
            await updateSleepGoal(userId, sleepGoal);
            onGoalChange(sleepGoal);
            setIsSaved(true);

            // Reset the saved indicator after 3 seconds
            setTimeout(() => {
                setIsSaved(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to update sleep goal:", error);
            alert("Failed to save sleep goal. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSleepGoal(currentGoal ?? 8);
    };

    return (
        <div className="">
            <div className="flex items-center gap-1 mb-1">
                <Moon className="text-indigo-400" size={24} />
                <h2 className="text-xl font-semibold text-white">
                    Set Your Sleep Goal
                </h2>
            </div>
            <p className="text-slate-300 mb-2">
                How many hours would you like to sleep each night?
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label
                            htmlFor="sleep-hours"
                            className="text-slate-300 text-sm"
                        >
                            Hours per night
                        </label>
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-medium ${
                                    isSaved
                                        ? "text-green-400"
                                        : "text-indigo-400"
                                }`}
                            >
                                {sleepGoal} {sleepGoal === 1 ? "hour" : "hours"}
                            </span>
                            {isSaved && (
                                <CheckCircle
                                    className="text-green-400"
                                    size={16}
                                />
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            id="sleep-hours"
                            type="range"
                            className="w-full accent-indigo-500 bg-slate-700 h-2 rounded-lg appearance-none cursor-pointer"
                            value={sleepGoal}
                            onChange={(e) =>
                                setSleepGoal(parseFloat(e.target.value))
                            }
                            min="1"
                            max="12"
                            step="0.5"
                            required
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                            <span>1h</span>
                            <span>12h</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex-1 bg-slate-700 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-600 transition"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:opacity-70 disabled:hover:bg-indigo-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Goal"}
                    </button>
                </div>
            </form>
        </div>
    );
}
