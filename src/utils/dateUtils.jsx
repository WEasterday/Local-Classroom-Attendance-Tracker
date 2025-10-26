import { today, getLocalTimeZone } from "@internationalized/date";

// Get today's CalendarDate
export const getTodayDate = () => today(getLocalTimeZone());

// Convert CalendarDate to: "MM-DD-YYYY"
export const formatDateKey = (calendarDate) => {
    const month = calendarDate.month.toString().padStart(2, "0");
    const day = calendarDate.day.toString().padStart(2, "0");
    const year = calendarDate.year;
    return `${month}-${day}-${year}`;
};

// Convert CalendarDate to: { month, day, year }
export const calendarDateToObject = (calendarDate) => ({
    month: calendarDate.month.toString().padStart(2, "0"),
    day: calendarDate.day.toString().padStart(2, "0"),
    year: calendarDate.year,
});

export const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hours12: true,
    });
}