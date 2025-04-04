import { useMemo, useState } from "react";
import {
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Line,
    Legend,
} from "recharts";

interface SleepChartProps {
    data: { date: string; hours: number }[];
    sleepGoal: number;
    view: "weekly" | "monthly";
}

// Format date to "dd MMM yy"
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
};

// Get latest recorded date
const getLatestDate = (data: { date: string }[]) => {
    if (data.length === 0) return new Date();
    return new Date(
        Math.max(...data.map((entry) => new Date(entry.date).getTime()))
    );
};

// Get start of the week (Monday)
const getStartOfWeek = (date: Date) => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = day === 0 ? -6 : 1 - day; // Move back to Monday
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

// Generate a full date range (week or month)
const generateDateRange = (start: Date, end: Date) => {
    const dates: string[] = [];
    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split("T")[0]); // Format YYYY-MM-DD
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export default function SleepChart({ data, sleepGoal, view }: SleepChartProps) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);

    const filteredData = useMemo(() => {
        if (data.length === 0) return [];
        const latestDate = getLatestDate(data);
        const baseDate = new Date(latestDate);
        let start: Date, end: Date;

        if (view === "weekly") {
            baseDate.setDate(baseDate.getDate() - weekOffset * 7);
            start = getStartOfWeek(baseDate);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
        } else {
            baseDate.setMonth(baseDate.getMonth() - monthOffset);
            start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
            end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
        }

        const fullDateRange = generateDateRange(start, end);
        const sleepMap = new Map(
            data.map((entry) => [entry.date, entry.hours])
        );

        return fullDateRange.map((date) => ({
            date,
            hours: sleepMap.get(date) ?? 0, // Fill missing days with 0
        }));
    }, [data, view, weekOffset, monthOffset]);

    // Calculate Y-axis domain dynamically
    const maxSleepHours = Math.max(
        ...filteredData.map((entry) => parseFloat(entry.hours.toPrecision(2))),
        sleepGoal,
        8
    );

    const yAxisMax = Math.ceil(maxSleepHours * 1.1);
    // const minSleepHours = Math.min(
    //     ...filteredData.map((entry) => parseFloat(entry.hours.toPrecision(2))),
    // );

    // Add sleep quality status to each entry
    const chartData = filteredData
        .filter((entry) => entry.hours > 0) // Filter out entries with 0 or negative hours
        .map((entry) => ({
            ...entry,
            sleepQuality:
                entry.hours >= sleepGoal
                    ? "Goal Met"
                    : entry.hours >= sleepGoal - 2
                    ? "Slight Deficit"
                    : "Significant Deficit",
        }));

    const statusColors = {
        good: "#22C55E",
        warning: "#EAB308",
        bad: "#ef4444", // Using a standard red as it's not in your theme
    };

    // Custom color based on sleep quality
    const getDotColor = (hours: number) => {
        if (hours >= sleepGoal) return statusColors.good;
        if (hours >= sleepGoal - 2) return statusColors.warning;
        if (hours <= 0) return undefined;
        return statusColors.bad;
    };

    const gradientOffsetWarning = ((sleepGoal - 2) / sleepGoal) * 100;
    const gradientOffsetGood = 100;

    return (
        <div className="flex flex-col w-full h-full gap-4 text-text">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Sleep Trend</h2>
            </div>

            <div className="flex justify-between mb-2">
                <button
                    className="px-3 py-1 text-sm bg-secondary hover:bg-opacity-80 rounded-md transition-colors text-text"
                    onClick={() => {
                        if (view === "weekly") {
                            setWeekOffset(weekOffset + 1);
                        } else {
                            setMonthOffset(monthOffset + 1);
                        }
                    }}
                >
                    ← Previous {view}
                </button>
                <button
                    className="px-3 py-1 text-sm bg-secondary hover:bg-opacity-80 rounded-md transition-colors text-text disabled:opacity-50"
                    onClick={() => {
                        if (view === "weekly") {
                            setWeekOffset(Math.max(0, weekOffset - 1));
                        } else {
                            setMonthOffset(Math.max(0, monthOffset - 1));
                        }
                    }}
                    disabled={weekOffset === 0 && monthOffset === 0}
                >
                    Next {view} →
                </button>
            </div>

            {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64 border rounded-lg bg-secondary bg-opacity-20">
                    No data available for this period
                </div>
            ) : (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 20,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="sleepGradient"
                                    x1="0"
                                    y1="1"
                                    x2="0"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={statusColors.bad}
                                    />
                                    <stop
                                        offset={`${gradientOffsetWarning}%`}
                                        stopColor={statusColors.warning}
                                    />
                                    <stop
                                        offset={`${gradientOffsetGood}%`}
                                        stopColor={statusColors.good}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12 }}
                                stroke="var(--text)"
                            />
                            <YAxis
                                domain={[0, yAxisMax]}
                                tickCount={6}
                                tick={{ fontSize: 12 }}
                                stroke="var(--text)"
                                label={{
                                    value: "Hours",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        textAnchor: "middle",
                                        fontSize: 12,
                                        fill: "var(--text)",
                                    },
                                }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload?.length) {
                                        const { date, hours, sleepQuality } =
                                            payload[0].payload;
                                        return (
                                            <div className="bg-background p-2 border border-secondary rounded shadow-md text-sm">
                                                <div className="font-bold">
                                                    {formatDate(date)}
                                                </div>
                                                <div>
                                                    {hours.toPrecision(2)} hours
                                                </div>
                                                <div
                                                    style={{
                                                        color:
                                                            sleepQuality ===
                                                            "Goal Met"
                                                                ? statusColors.good
                                                                : sleepQuality ===
                                                                  "Slight Deficit"
                                                                ? statusColors.warning
                                                                : statusColors.bad,
                                                    }}
                                                >
                                                    {sleepQuality}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {/* Main Sleep Trend Line */}
                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="url(#sleepGradient)"
                                strokeWidth={3}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={getDotColor(payload.hours)}
                                            stroke="var(--background)"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                                activeDot={{
                                    r: 8,
                                    stroke: "var(--background)",
                                    strokeWidth: 2,
                                }}
                            />
                            {/* Sleep Goal Reference Line */}
                            <ReferenceLine
                                y={sleepGoal}
                                stroke={statusColors.good}
                                strokeDasharray="3 3"
                                label={{
                                    value: `${sleepGoal}`,
                                    position: "left",
                                    fill: statusColors.good,
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    offset: 20,
                                }}
                            />
                            <Legend
                                content={() => (
                                    <div className="flex justify-around text-xs mt-2">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-1"
                                                style={{
                                                    backgroundColor:
                                                        statusColors.good,
                                                }}
                                            ></div>
                                            <span>
                                                Goal Met (≥{sleepGoal}h)
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-1"
                                                style={{
                                                    backgroundColor:
                                                        statusColors.warning,
                                                }}
                                            ></div>
                                            <span>
                                                Slight Deficit ({sleepGoal - 2}-
                                                {sleepGoal - 0.1}h)
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-1"
                                                style={{
                                                    backgroundColor:
                                                        statusColors.bad,
                                                }}
                                            ></div>
                                            <span>
                                                Significant Deficit (&lt;
                                                {sleepGoal - 2}h)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
