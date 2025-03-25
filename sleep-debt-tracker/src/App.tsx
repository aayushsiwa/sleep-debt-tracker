import { useEffect, useState, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import SleepChart from "./components/SleepChart";
import { getSleepLogs } from "./api.ts";

export default function App() {
    const [sleepData, setSleepData] = useState<
        { date: string; hours: number }[]
    >([]);
    const [sleepDebt, setSleepDebt] = useState(0);
    const [userId, setUserId] = useState("660fbc9d6f7b4a5c3d0f1234");
    const idealSleepHours = 8;

    const fetchData = useCallback(async () => {
        if (!userId) return;
        console.log("Fetching data for userId:", userId);

        const logs = await getSleepLogs(userId);
        console.log("Fetched raw logs:", logs);

        let totalSleepDebt = 0;
        const aggregatedData = logs.reduce((acc, log) => {
            const timestamp = log.startTime * 1000; // Convert to milliseconds
            const date = new Date(timestamp).toISOString().split("T")[0]; // Force UTC format
            const hours = log.duration / 60; // Convert minutes to hours

            console.log(`Processing log:`, {
                timestamp,
                formattedDate: date,
                durationMinutes: log.duration,
                durationHours: hours,
            });

            acc[date] = (acc[date] || 0) + hours;
            return acc;
        }, {} as Record<string, number>);

        console.log("Aggregated sleep data:", aggregatedData);

        // Calculate sleep debt
        totalSleepDebt = Object.values(aggregatedData).reduce(
            (debt, hours) => debt + Math.max(0, idealSleepHours - hours),
            0
        );

        setSleepDebt(totalSleepDebt);
        setSleepData(
            Object.entries(aggregatedData).map(([date, hours]) => ({
                date,
                hours,
            }))
        );

        console.log(
            "Final processed sleep data:",
            Object.entries(aggregatedData).map(([date, hours]) => ({
                date,
                hours,
            }))
        );
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <h1 className="text-3xl font-bold">NapTrack</h1>
            <p
                className={`text-lg font-semibold ${
                    sleepDebt > 10
                        ? "text-red-500"
                        : sleepDebt > 5
                        ? "text-yellow-500"
                        : "text-green-400"
                }`}
            >
                Sleep Debt: {sleepDebt.toFixed(1)} hours
            </p>
            <Dashboard userId={userId} />
            <SleepChart data={sleepData} />
        </div>
    );
}
