import { useState, useRef, useEffect } from "react";
import { addSleepEntry } from "../api/sleep";
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
  }, [startTime, endTime]);

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

  function formatDateTime(date: Date) {
    return date.toISOString().slice(0, 16);
  }

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
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return alert("User ID missing");
    if (error) return;

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
        className="bg-primary hover:bg-accent text-text p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
        onClick={() => modalRef.current?.showModal()}
        aria-label="Add sleep entry"
      >
        <Plus size={24} />
      </button>

      <dialog
        ref={modalRef}
        className="bg-background text-text p-0 rounded-xl shadow-2xl border border-primary backdrop:bg-secondary/80 w-full max-w-md"
      >
        <div className="flex flex-col">
          <div className="bg-secondary bg-opacity-20 p-5 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <Moon className="text-accent" size={20} />
              <h2 className="text-xl font-semibold">Add Sleep Entry</h2>
            </div>
            <button
              type="button"
              className="text-secondary hover:text-text transition-colors p-1 rounded-full hover:bg-primary/20"
              onClick={() => modalRef.current?.close()}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {error && (
              <div className="bg-accent/20 text-accent text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="start-time" className="text-secondary font-medium flex items-center gap-2">
                  <Moon size={16} className="text-accent" />
                  Bedtime
                </label>
                <input
                  id="start-time"
                  type="datetime-local"
                  className="w-full bg-secondary bg-opacity-20 p-3 rounded-lg text-text border border-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="end-time" className="text-secondary font-medium flex items-center gap-2">
                  <SunMedium size={16} className="text-accent" />
                  Wake-up Time
                </label>
                <input
                  id="end-time"
                  type="datetime-local"
                  className="w-full bg-secondary bg-opacity-20 p-3 rounded-lg text-text border border-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-center text-lg font-bold text-accent">
              {duration.hours}h {duration.minutes}m
              <div className="text-secondary text-sm">Sleep Duration</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 bg-secondary hover:bg-primary/50 px-4 py-3 rounded-lg text-text transition-colors flex items-center justify-center gap-2"
                onClick={() => modalRef.current?.close()}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-accent px-4 py-3 rounded-lg text-text font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-primary"
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