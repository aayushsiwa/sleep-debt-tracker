import { useEffect, useState, useCallback } from "react";
import SleepForm from "./SleepForm";
import SleepGoalForm from "./SleepGoalForm";
import SleepChart from "./SleepChart";
import Sidebar from "./Sidebar";
import { getSleepGoal } from "../api";

interface DashboardProps {
    userId: string;
    refreshData: () => void;
    sleepDebt: number;
    sleepData: Array<{
        date: string;
        hours: number;
    }>;
}

export default function Dashboard({
    userId,
    refreshData,
    sleepDebt,
    sleepData,
}: DashboardProps) {
    const [sleepGoal, setSleepGoal] = useState<number | 0>(0);

    const fetchSleepData = useCallback(async () => {
        if (!userId) return console.error("User ID is missing");

        try {
            const goal = await getSleepGoal(userId);
            setSleepGoal(goal);
        } catch (error) {
            console.error("Error fetching sleep data", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchSleepData();
    }, [fetchSleepData]);

    const handleSleepDebtUpdate = () => {
        fetchSleepData();
        refreshData();
    };

    return (
        <div className="bg-gray-900 text-white flex h-full w-full p-4">
            <Sidebar userId={userId} />
            {/* Main Content */}
            <main className="flex-1 ps-4">
                {/* <h1 className="text-2xl font-semibold">Dashboard</h1> */}
                <div className="flex gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg w-1/4">
                        <h2 className="text-lg">Your Sleep Debt</h2>
                        <p
                            className={`text-2xl font-semibold ${
                                sleepDebt > 10
                                    ? "text-red-500"
                                    : sleepDebt > 5
                                    ? "text-yellow-500"
                                    : "text-green-400"
                            }`}
                        >
                            {sleepDebt.toFixed(1)} hours
                        </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-1/4">
                        <h2 className="text-lg">Your Sleep Debt</h2>
                        <p
                            className={`text-2xl font-semibold ${
                                sleepDebt > 10
                                    ? "text-red-500"
                                    : sleepDebt > 5
                                    ? "text-yellow-500"
                                    : "text-green-400"
                            }`}
                        >
                            {sleepDebt.toFixed(1)} hours
                        </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-1/4">
                        <h2 className="text-lg">Your Sleep Debt</h2>
                        <p
                            className={`text-2xl font-semibold ${
                                sleepDebt > 10
                                    ? "text-red-500"
                                    : sleepDebt > 5
                                    ? "text-yellow-500"
                                    : "text-green-400"
                            }`}
                        >
                            {sleepDebt.toFixed(1)} hours
                        </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-1/4">
                        <SleepGoalForm
                            userId={userId}
                            currentGoal={sleepGoal ?? 0}
                            onGoalChange={handleSleepDebtUpdate}
                        />
                    </div>
                </div>

                {/* Sleep Chart */}
                <div className="mt-4 h-1/2 w-full">
                    <SleepChart
                        data={sleepData}
                        sleepGoal={sleepGoal ?? 0}
                        key={sleepData.length}
                    />
                </div>
            </main>
            {/* <h1 className="text-2xl font-bold">Sleep Dashboard</h1> */}

            <SleepForm userId={userId} onSuccess={handleSleepDebtUpdate} />
        </div>
    );
}
