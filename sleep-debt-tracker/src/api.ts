import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch sleep logs
export const getSleepLogs = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching sleep logs", error);
        return [];
    }
};

// Fetch sleep debt
export const getSleepDebt = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/debt/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching sleep debt", error);
        return null;
    }
};

// Fetch sleep goal
export const getSleepGoal = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/${userId}/sleep-goal`);
        return res.data.sleepGoal / 60; // Convert minutes to hours
    } catch (error) {
        console.error("Error fetching sleep goal", error);
        return null;
    }
};

// Add a new sleep entry
export const addSleepEntry = async (userId, startTime, endTime) => {
    try {
        const res = await axios.post(`${API_URL}/add`, { userId, startTime, endTime });
        return res.data;
    } catch (error) {
        console.error("Error adding sleep entry", error);
        return null;
    }
};



// Update sleep goal
export const updateSleepGoal = async (userId, sleepGoal) => {
    try {
        await axios.put(`${API_URL}/${userId}/sleep-goal`, { sleepGoal: sleepGoal * 60 }); // Convert hours to minutes
    } catch (error) {
        console.error("Error updating sleep goal", error);
    }
};
