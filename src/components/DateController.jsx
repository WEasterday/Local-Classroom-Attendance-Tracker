import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

// I have to parse the data back, I'd rather do it here than in both Student & Class Selections
function normalizeDate(value) {
  // Already a CalendarDate
  if (typeof value.toDate === "function") return value;

  // Object with year, month, day
  if (value.year && value.month && value.day) {
    const y = value.year;
    const m = String(value.month).padStart(2, "0");
    const d = String(value.day).padStart(2, "0");
    return parseDate(`${y}-${m}-${d}`);
  }
}

const DateController = ({ selectedDate, setSelectedDate }) => {
  const normalizedDate = normalizeDate(selectedDate);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <DatePicker
        label=""
        value={normalizedDate}
        onChange={setSelectedDate}
        calendarProps={{
          focusedValue: normalizedDate,
          onFocusChange: setSelectedDate,
        }}
        className="text-white rounded font-semibold"
      />
    </div>
  );
};

export default DateController;
