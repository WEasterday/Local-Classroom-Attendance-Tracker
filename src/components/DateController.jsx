import { DatePicker } from "@heroui/react";

const DateController = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <DatePicker
        label=""
        value={selectedDate}
        onChange={setSelectedDate}
        calendarProps={{
          focusedValue: selectedDate,
          onFocusChange: setSelectedDate,
        }}
      />
    </div>
  );
};

export default DateController;