const DAILY_SLEEP_GOAL = 8 * 60; // 8 hours in minutes
export function calculateSleepDebt(sleepLogs) {
    const dailySleep = {};
    sleepLogs.forEach(({ startTime, endTime }) => {
        let start = new Date(startTime);
        let end = new Date(endTime);
        while (start < end) {
            let currentDay = start.toISOString().split("T")[0]; // YYYY-MM-DD
            let nextMidnight = new Date(start);
            nextMidnight.setHours(24, 0, 0, 0);
            let sleepEnd = end < nextMidnight ? end : nextMidnight;
            let sleepDuration = (Number(sleepEnd) - Number(start)) / (1000 * 60); // ms → minutes
            dailySleep[currentDay] = (dailySleep[currentDay] || 0) + sleepDuration;
            start = sleepEnd; // Move forward
        }
    });
    const sleepDebt = {};
    Object.keys(dailySleep).forEach((date) => {
        let actualSleep = dailySleep[date];
        sleepDebt[date] = Math.max(0, DAILY_SLEEP_GOAL - actualSleep);
    });
    return sleepDebt;
}
