import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SleepChart({ data }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-lg text-white">Sleep Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
