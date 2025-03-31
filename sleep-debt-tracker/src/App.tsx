import { useEffect, useState, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { getSleepGoal, getSleepLogs } from "./api";

// Define TypeScript interfaces for sleep data
interface SleepEntry {
    date: string;
    hours: number;
}

export default function App() {
    const [sleepData, setSleepData] = useState<SleepEntry[]>([]);
    const [sleepDebt, setSleepDebt] = useState<number>(0);
    const userId = "johndoe"; // Hardcoded for now; replace with dynamic user logic

    // Fetch sleep data
    const fetchData = useCallback(
        async (callback?: (data: SleepEntry[]) => void) => {
            if (!userId) return;

            try {
                const [logs, goal] = await Promise.all([
                    getSleepLogs(userId),
                    getSleepGoal(userId),
                ]);

                if (!Array.isArray(logs) || logs.length === 0) {
                    console.warn("No sleep logs found for user:", userId);
                    setSleepData([]);
                    setSleepDebt(0);
                    return;
                }

                let totalSleepDebt = 0;
                const aggregatedData = logs.reduce<Record<string, number>>(
                    (acc, log) => {
                        const timestamp = log.startTime * 1000;
                        const date = new Date(timestamp)
                            .toISOString()
                            .split("T")[0];
                        const hours = log.duration / 60;

                        if (hours < 0) {
                            console.warn(
                                `Skipping invalid entry: ${date} with duration ${hours} hours`
                            );
                            return acc;
                        }

                        acc[date] = (acc[date] || 0) + hours;
                        return acc;
                    },
                    {}
                );
                totalSleepDebt = Object.values(aggregatedData).reduce(
                    (debt, hours) => debt + goal - hours, // ✅ Use the fetched goal
                    0
                );
                // console log the aggregated data hours
                // console.log(
                //     "Aggregated Data:",
                //     Object.values(aggregatedData).reduce(
                //         (date, hours) =>
                //             ` ${date}: ${hours} hours`,
                //         ""
                //     )
                // );

                const newSleepData = Object.entries(aggregatedData).map(
                    ([date, hours]) => ({
                        date,
                        hours,
                    })
                );

                setSleepDebt(totalSleepDebt);
                setSleepData(newSleepData);

                if (callback) callback(newSleepData);
            } catch (error) {
                console.error("❌ Error fetching sleep data:", error);
            }
        },
        [userId]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="bg-gray-900 text-white max-h-screen">
            <Navbar />
            <Dashboard
                userId={userId}
                refreshData={fetchData}
                sleepDebt={sleepDebt}
                sleepData={sleepData}
            />
        </div>
    );
}
