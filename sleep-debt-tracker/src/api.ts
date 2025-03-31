import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;
const sleepAPI=`${API_URL}/api/sleep`;

// Helper function for error logging
const handleApiError = (error: unknown, action: string) => {
    if (axios.isAxiosError(error)) {
        console.error(`❌ API Error [${action}]:`, error.response?.data || error.message);
    } else {
        console.error(`❌ Unexpected Error [${action}]:`, error);
    }
};

// ✅ Fetch sleep logs
export const getSleepLogs = async (userId: string) => {
    try {
        const res = await axios.get(`${sleepAPI}/${userId}`);
        if (!Array.isArray(res.data)) {
            console.warn("⚠️ Unexpected sleep logs response:", res.data);
            return [];
        }
        return res.data;
    } catch (error) {
        handleApiError(error, "Fetching sleep logs");
        return []; // Return an empty array for new users or API failures
    }
};

// ✅ Fetch sleep debt
export const getSleepDebt = async (userId: string) => {
    try {
        const res = await axios.get(`${sleepAPI}/debt/${userId}`);
        if (!res.data || typeof res.data.sleepDebt !== "number") {
            console.warn("⚠️ Unexpected sleep debt response:", res.data);
            return 0; // Default sleep debt to 0
        }
        return res.data.sleepDebt;
    } catch (error) {
        handleApiError(error, "Fetching sleep debt");
        return 0;
    }
};

// ✅ Fetch sleep goal
export const getSleepGoal = async (userId: string) => {
    try {
        const res = await axios.get(`${sleepAPI}/${userId}/sleep-goal`);
        if (!res.data || typeof res.data.sleepGoal !== "number") {
            console.warn("⚠️ Unexpected sleep goal response:", res.data);
            return 8; // Default goal: 8 hours
        }
        return res.data.sleepGoal / 60; // Convert minutes to hours
    } catch (error) {
        handleApiError(error, "Fetching sleep goal");
        return 8;
    }
};

// ✅ Add a new sleep entry
export const addSleepEntry = async (userId: string, startTime: number, endTime: number) => {
    try {
        const res = await axios.post(`${sleepAPI}/add`, { userId, startTime, endTime });
        return res.data;
    } catch (error) {
        handleApiError(error, "Adding sleep entry");
        return null;
    }
};

// ✅ Update sleep goal
export const updateSleepGoal = async (userId: string, sleepGoal: number) => {
    try {
        await axios.put(`${sleepAPI}/${userId}/sleep-goal`, { sleepGoal: sleepGoal * 60 }); // Convert to minutes
    } catch (error) {
        handleApiError(error, "Updating sleep goal");
    }
};
