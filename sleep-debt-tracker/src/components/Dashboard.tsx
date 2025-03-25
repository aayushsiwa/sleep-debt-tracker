// import SleepChart from "./Sleepchart";

// export default function Dashboard() {
//   return (
//     <div className="bg-gray-900 text-white flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 p-6">
//         <h2 className="text-xl font-bold">SleepSync</h2>
//         <nav className="mt-6 space-y-2">
//           <a href="#" className="block py-2 text-gray-400 hover:text-white transition">Overview</a>
//           <a href="#" className="block py-2 text-gray-400 hover:text-white transition">Sleep Logs</a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h2 className="text-lg">Your Sleep Debt</h2>
//           <p className="text-gray-400">You are behind by 5 hours this week.</p>
//         </div>

//         {/* Sleep Chart */}
//         <div className="mt-6">
//           <SleepChart />
//         </div>
//       </main>

//       {/* Floating Action Button */}
//       <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
//         ➕
//       </button>
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import SleepForm from "./SleepForm";
import SleepGoalForm from "./SleepGoalForm";
import { getSleepDebt, getSleepGoal } from "../api";

interface DashboardProps {
    userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
    const [sleepDebt, setSleepDebt] = useState<{ message: string } | null>(
        null
    );
    const [sleepGoal, setSleepGoal] = useState<number | null>(null);

    const fetchSleepData = useCallback(async () => {
      if (!userId) return console.error("User ID is missing");
  
      try {
          const [debt, goal] = await Promise.all([getSleepDebt(userId), getSleepGoal(userId)]);
          setSleepDebt(debt);
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
    };

    return (
        <div className="bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold">Sleep Dashboard</h1>

            <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <h2 className="text-lg">Your Sleep Debt</h2>
                <p className="text-gray-300">
                    {sleepDebt ? sleepDebt.message : "Loading..."}
                </p>
            </div>

            <SleepGoalForm
                userId={userId}
                currentGoal={sleepGoal ?? 0} // Ensure it's always a number
                onGoalChange={handleSleepDebtUpdate}
            />
            <SleepForm userId={userId} onSuccess={handleSleepDebtUpdate} />
        </div>
    );
}
