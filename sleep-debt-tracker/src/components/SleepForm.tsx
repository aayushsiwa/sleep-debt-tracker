import { useState, useRef, useEffect } from "react";
import { addSleepEntry } from "../api";
import { Plus, Moon, SunMedium, X, Save } from "lucide-react";

interface SleepFormProps {
  userId: string;
  onSuccess: () => void;
}

export default function SleepForm({ userId, onSuccess }: SleepFormProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(getDefaultEndTime());
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    validateAndCalculateDuration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  /** Get default sleep times */
  function getDefaultStartTime() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 0, 0, 0);
    return formatDateTime(yesterday);
  }

  function getDefaultEndTime() {
    const today = new Date();
    today.setHours(7, 0, 0, 0);
    return formatDateTime(today);
  }

  function formatDateTime(date:Date) {
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  /** Validates and calculates sleep duration */
  function validateAndCalculateDuration() {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();

    if (isNaN(diffMs) || diffMs <= 0) {
      setDuration({ hours: 0, minutes: 0 });
      setError("End time must be after start time.");
      return;
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24 || (diffHours === 24 && diffMinutes > 0)) {
      setError("Sleep duration cannot exceed 24 hours.");
      setDuration({ hours: 0, minutes: 0 });
      return;
    }

    setDuration({ hours: diffHours, minutes: diffMinutes });
    setError(""); // Clear previous errors
  }

  /**  Handles sleep entry submission */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return alert("User ID missing");
    if (error) return; // Prevent submission if invalid duration

    try {
      setIsSubmitting(true);
      await addSleepEntry(
        userId, 
        Date.parse(startTime), 
        Date.parse(endTime)
      );
      if (modalRef.current) {
        modalRef.current.close();
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to add sleep entry:", error);
      alert("Failed to save sleep entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-10">
      <button 
        className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
        onClick={() => modalRef.current?.showModal()}
        aria-label="Add sleep entry"
      >
        <Plus size={24} />
      </button>
      
      <dialog 
        ref={modalRef} 
        className="bg-slate-900 text-white p-0 rounded-xl shadow-2xl border border-slate-700 backdrop:bg-slate-900/80 w-full max-w-md"
      >
        <div className="flex flex-col">
          <div className="bg-slate-800 p-5 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <Moon className="text-indigo-400" size={20} />
              <h2 className="text-xl font-semibold">Add Sleep Entry</h2>
            </div>
            <button 
              type="button" 
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
              onClick={() => modalRef.current?.close()}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-700 text-white text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* 🛏️ Bedtime Input */}
              <div className="space-y-2">
                <label htmlFor="start-time" className="text-slate-300 font-medium flex items-center gap-2">
                  <Moon size={16} className="text-indigo-400" />
                  Bedtime
                </label>
                <input 
                  id="start-time"
                  type="datetime-local" 
                  className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                  autoFocus
                  required 
                />
              </div>
              
              {/* ☀️ Wake-up Time Input */}
              <div className="space-y-2">
                <label htmlFor="end-time" className="text-slate-300 font-medium flex items-center gap-2">
                  <SunMedium size={16} className="text-amber-400" />
                  Wake-up Time
                </label>
                <input 
                  id="end-time"
                  type="datetime-local" 
                  className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            {/* ⏳ Sleep Duration */}
            <div className="text-center text-lg font-bold text-indigo-400">
              {duration.hours}h {duration.minutes}m
              <div className="text-slate-400 text-sm">Sleep Duration</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg text-slate-300 transition-colors flex items-center justify-center gap-2"
                onClick={() => modalRef.current?.close()}
              >
                <X size={18} />
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-indigo-600"
                disabled={isSubmitting || !!error}
              >
                <Save size={18} />
                {isSubmitting ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
