import { today, getLocalTimeZone } from "@internationalized/date";

// Get today's CalendarDate
export const getTodayDate = () => today(getLocalTimeZone());

// Convert CalendarDate to: "MM-DD-YYYY"
export const formatDateKey = (inputDate) => {
    if (!inputDate) return "";

    // @internationalized/date
    if ("month" in inputDate && "day" in inputDate && "year" in inputDate) {
        const month = inputDate.month.toString().padStart(2, "0");
        const day = inputDate.day.toString().padStart(2, "0");
        const year = inputDate.year;
        return `${month}-${day}-${year}`;
    }

    // jS Date
    if (inputDate instanceof Date && !isNaN(inputDate)) {
        const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
        const day = inputDate.getDate().toString().padStart(2, "0");
        const year = inputDate.getFullYear();
        return `${month}-${day}-${year}`;
    }

    return "";
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

export const getWeekRange = (dateInput) => {
    let givenDate;

    // Support CalendarDate or js Date
    if (dateInput instanceof Date) {
        givenDate = new Date(dateInput);
    } else if ("year" in dateInput && "month" in dateInput && "day" in dateInput) {
        givenDate = new Date(dateInput.year, dateInput.month - 1, dateInput.day);
    } else {
        throw new Error("Invalid date input passed to getWeekRange");
    }

    const day = givenDate.getDay();
    const monday = new Date(givenDate);
    const friday = new Date(givenDate);

    const diffToMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(givenDate.getDate() + diffToMonday);
    friday.setDate(monday.getDate() + 4);

    monday.setHours(0, 0, 0, 0);
    friday.setHours(23, 59, 59, 999);

    return { monday, friday };  
};