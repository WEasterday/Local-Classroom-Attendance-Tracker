import { formatDateKey } from "../utils/dateUtils";

const AttendanceData = ({ selectedDate, selectedPeriod, selectedRotation}) => {
    const dateKey = formatDateKey(selectedDate);
    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const attendance = stored[selectedRotation]?.[selectedPeriod]?.[dateKey] || null;

    console.log("stored:", stored)
    console.log(attendance);

    if (!attendance) {
        return (
            <p>
                No attendance record found for {selectedRotation} Day, Period{" "}
                {selectedPeriod} on {dateKey}.
            </p>
        );
    }

    return (
        <div className="pb-14">
            <h2>
                {selectedRotation} Day {selectedPeriod} Period {attendance.date.month}/{attendance.date.day}/{attendance.date.year}
            </h2>

            <h2>
                {attendance.selectedDateTypeObj.description} Schedule from {attendance.selectedDateTypeObj[selectedPeriod].start} - {attendance.selectedDateTypeObj[selectedPeriod].end}
            </h2>

            <h3 className="font-bold">Present Students</h3>
            <ul>
                {attendance.presentStudents.map((student, index) => (
                    <li key={`present-${index}`}>{student.name} at {student.timestamp}</li>
                ))}
            </ul>

            <h3 className="font-bold">Absent Students</h3>
            <ul>
                {attendance.absentStudents.map((student, index) => (
                    <li key={`absent-${index}`}>{`${student.name} ${student.note  || ""} ${student.timestamp  || ""}`}</li>
                ))}
            </ul>
        </div>
    );
}

export default AttendanceData