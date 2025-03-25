import { useState, useRef } from "react";
import { addSleepEntry } from "../api";

export default function SleepForm({ userId, onSuccess }) {
    const modalRef = useRef(null);
    
    const formatDateTime = (date) => date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

    const getDefaultStartTime = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(23, 0, 0, 0);
        return formatDateTime(yesterday);
    };

    const getDefaultEndTime = () => {
        const today = new Date();
        today.setHours(7, 0, 0, 0);
        return formatDateTime(today);
    };

    const [startTime, setStartTime] = useState(getDefaultStartTime());
    const [endTime, setEndTime] = useState(getDefaultEndTime());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return alert("User ID missing");

        await addSleepEntry(userId, new Date(startTime).toISOString(), new Date(endTime).toISOString());

        modalRef.current.close();
        onSuccess();
    };

    return (
        <div className="fixed bottom-8 right-8">
            <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
                onClick={() => modalRef.current.showModal()}>
                ➕
            </button>

            <dialog ref={modalRef} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg mb-4">Add Sleep Entry</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">Start Time:</label>
                    <input type="datetime-local" className="w-full bg-gray-800 p-2 rounded text-white"
                        value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

                    <label className="block mt-3 mb-2">End Time:</label>
                    <input type="datetime-local" className="w-full bg-gray-800 p-2 rounded text-white"
                        value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

                    <div className="mt-4 flex gap-2">
                        <button type="submit" className="bg-blue-500 px-4 py-2 rounded">Save</button>
                        <button type="button" className="bg-gray-500 px-4 py-2 rounded"
                            onClick={() => modalRef.current.close()}>Close</button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
