import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
} from "recharts";

interface SleepChartProps {
  data: { date: string; hours: number }[];
  sleepGoal: number;
}

export default function SleepChart({ data, sleepGoal }: SleepChartProps) {
  // Ensure we have a non-zero maxSleepHours to avoid division issues
  const maxSleepHours = Math.max(
      ...data.map((entry) => entry.hours),
      sleepGoal,
      1 // Ensure it's at least 1 to avoid NaN offsets
  );

  const getGradientStops = () => {
      const significantDeficit = Math.max(0, sleepGoal - sleepGoal / 2); // 50% of goal
      const slightDeficit = Math.max(0, sleepGoal - 2); // 2 hours less than goal

      // Avoid division by zero
      const redOffset = significantDeficit / maxSleepHours || 0;
      const yellowOffset = slightDeficit / maxSleepHours || 0;
      const greenOffset = 1;

      return {
          red: Math.min(redOffset, 1),
          yellow: Math.min(yellowOffset, 1),
          green: greenOffset,
      };
  };

  const stops = getGradientStops();

  // Function to determine dot color based on sleep hours
  const getDotColor = (hours: number) => {
      if (hours >= sleepGoal) return "#22C55E";
      if (hours <= sleepGoal - sleepGoal / 2) return "#EF4444";
      return "#FACC15";
  };

  return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg text-white mb-4">Sleep Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                  <defs>
                      <linearGradient
                          id="sleepColorGradient"
                          x1="0"
                          y1="1"
                          x2="0"
                          y2="0"
                      >
                          <stop offset="0" stopColor="#EF4444" />
                          <stop offset={stops.red.toString()} stopColor="#EF4444" />
                          <stop offset={stops.red.toString()} stopColor="#FACC15" />
                          <stop offset={stops.yellow.toString()} stopColor="#FACC15" />
                          <stop offset={stops.yellow.toString()} stopColor="#22C55E" />
                          <stop offset={stops.green.toString()} stopColor="#22C55E" />
                      </linearGradient>
                  </defs>

                  <XAxis
                      dataKey="date"
                      stroke="white"
                      tick={{ fill: "white" }}
                      tickLine={{ stroke: "white" }}
                  />
                  <YAxis
                      stroke="white"
                      tick={{ fill: "white" }}
                      tickLine={{ stroke: "white" }}
                      domain={[0, maxSleepHours]}
                  />
                  <Tooltip
                      contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "4px",
                          color: "white",
                      }}
                      formatter={(value) => [`${value} hours`, "Sleep"]}
                  />

                  <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="url(#sleepColorGradient)"
                      strokeWidth={2}
                      dot={(props) => {
                          const { cx, cy, payload } = props;
                          return (
                              <circle
                                  key={payload.date} // Ensure unique key
                                  cx={cx}
                                  cy={cy}
                                  r={4}
                                  fill={getDotColor(payload.hours)}
                                  stroke="#ffffff"
                                  strokeWidth={1}
                              />
                          );
                      }}
                  />

                  <ReferenceLine
                      y={sleepGoal}
                      stroke="#ffffff"
                      strokeDasharray="5 5"
                      label={{
                          position: "insideTopRight",
                          value: "Sleep Goal",
                          fill: "white",
                          fontSize: 12,
                      }}
                  />
              </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  <span className="text-gray-300">
                      Goal Met (≥{sleepGoal}h)
                  </span>
              </div>
              <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FACC15]"></div>
                  <span className="text-gray-300">
                      Slight Deficit ({sleepGoal - 2}-{sleepGoal}h)
                  </span>
              </div>
              <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <span className="text-gray-300">
                      Significant Deficit (≤{sleepGoal - sleepGoal / 2}h)
                  </span>
              </div>
          </div>
      </div>
  );
}
