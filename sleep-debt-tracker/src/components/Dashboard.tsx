import { useEffect, useState, useCallback, useMemo } from "react";
import SleepForm from "./SleepForm";
import SleepGoalForm from "./SleepGoalForm";
import SleepChart from "./SleepChart";
import { getSleepGoal } from "../api/sleep";

interface DashboardProps {
    userId: string | null;
    refreshData: () => void;
    sleepDebt: number;
    sleepData: Array<{
        date: string;
        hours: number;
    }>;
    onUserAuthenticated?: (userId: string) => void;
}

export default function Dashboard({
    userId,
    refreshData,
    sleepData,
}: DashboardProps) {
    const [sleepGoal, setSleepGoal] = useState<number | 0>(0);
    const [view, setView] = useState<"weekly" | "monthly">("weekly");
    // const [authError, setAuthError] = useState<string | null>(null);

    const fetchSleepData = useCallback(async () => {
        if (!userId) return;
        try {
            const goal = await getSleepGoal(userId);
            setSleepGoal(goal);
        } catch (error) {
            console.error("Error fetching sleep data", error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchSleepData();
        }
    }, [fetchSleepData, userId]);

    const handleSleepDebtUpdate = () => {
        fetchSleepData();
        refreshData();
    };

    const calculateSleepDebt = useMemo(() => {
        const now = new Date();
        let startDate: Date;

        if (view === "weekly") {
            const diff = now.getDay() === 0 ? -6 : 1 - now.getDay();
            startDate = new Date(now.setDate(now.getDate() + diff));
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const filteredSleepData = sleepData.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate;
        });

        const totalSleep = filteredSleepData.reduce(
            (sum, entry) => sum + entry.hours,
            0
        );
        const targetSleep = filteredSleepData.length * (sleepGoal || 0);

        return targetSleep - totalSleep;
    }, [sleepData, view, sleepGoal]);

    const getDebtColor = (debt: number) => {
        if (debt > 10) return "text-accent"; // Using accent instead of hardcoded red
        if (debt > 5) return "text-secondary"; // Using secondary as a middle ground
        return "text-primary";
    };

    return (
        <div className="bg-background text-text flex h-full w-full ps-4 gap-4">
            <main className="flex-1 flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="bg-secondary bg-opacity-10 p-5 rounded-xl shadow-sm flex-1 border border-primary border-opacity-20">
                        <h2 className="text-sm uppercase font-medium opacity-70">
                            Your Sleep Debt
                        </h2>
                        <p
                            className={`text-3xl font-bold mt-2 ${getDebtColor(
                                calculateSleepDebt
                            )}`}
                        >
                            {calculateSleepDebt.toFixed(1)} hours
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                            Based on your {view} data
                        </p>
                    </div>

                    <div className="bg-secondary bg-opacity-10 p-5 rounded-xl shadow-sm flex-1 border border-primary border-opacity-20">
                        <h2 className="text-sm uppercase font-medium opacity-70">
                            Average Sleep
                        </h2>
                        <p className="text-3xl font-bold mt-2 text-primary">
                            {sleepData.length > 0
                                ? (
                                      sleepData.reduce(
                                          (sum, entry) => sum + entry.hours,
                                          0
                                      ) / sleepData.length
                                  ).toFixed(1)
                                : "0.0"}{" "}
                            hours
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                            Overall average
                        </p>
                    </div>

                    <div className="bg-secondary bg-opacity-10 p-5 rounded-xl shadow-sm flex-1 border border-primary border-opacity-20">
                        <h2 className="text-sm uppercase font-medium opacity-70">
                            Days Tracked
                        </h2>
                        <p className="text-3xl font-bold mt-2 text-accent">
                            {sleepData.length}
                        </p>
                        <p className="text-xs mt-1 opacity-70">Total records</p>
                    </div>

                    <div className="bg-secondary bg-opacity-10 p-5 rounded-xl shadow-sm flex-1 border border-primary border-opacity-20">
                        {userId && (
                            <SleepGoalForm
                                userId={userId}
                                currentGoal={sleepGoal ?? 0}
                                onGoalChange={handleSleepDebtUpdate}
                            />
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className={`px-4 py-2 rounded-lg transition-all text-text ${
                            view === "weekly"
                                ? "bg-primary font-medium shadow-md"
                                : "hover:bg-accent hover:text-white"
                        }`}
                        onClick={() => setView("weekly")}
                    >
                        Weekly View
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-all text-text ${
                            view === "monthly"
                                ? "bg-primary font-medium shadow-md"
                                : " hover:bg-accent hover:text-white"
                        }`}
                        onClick={() => setView("monthly")}
                    >
                        Monthly View
                    </button>
                </div>

                <div className="bg-secondary bg-opacity-10 p-6 rounded-xl shadow-sm flex-1 border border-primary border-opacity-20">
                    <SleepChart
                        data={sleepData}
                        sleepGoal={sleepGoal ?? 0}
                        key={sleepData.length + view}
                        view={view}
                    />
                </div>
            </main>

            <div className="w-1/4 min-w-80 bg-secondary bg-opacity-10 p-6 rounded-xl shadow-sm border border-primary border-opacity-20">
                <h2 className="text-lg font-semibold mb-4">Log Sleep</h2>
                {userId && (
                    <SleepForm userId={userId} onSuccess={handleSleepDebtUpdate} />
                )}
            </div>
        </div>
    );
}
