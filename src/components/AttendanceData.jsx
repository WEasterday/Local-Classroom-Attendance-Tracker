import { formatDateKey } from "../utils/dateUtils";

const AttendanceData = ({ selectedDate, selectedPeriod, selectedRotation }) => {
    const dateKey = formatDateKey(selectedDate);
    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const attendance = stored[selectedRotation]?.[selectedPeriod]?.[dateKey] || null;

    console.log("stored:", stored)

    if (!attendance) {
        return (
            <p>
                No attendance record found for {selectedRotation} Day, Period{" "}
                {selectedPeriod} on {dateKey}.
            </p>
        );
    }

    return (
        <div>
            <h2>
                Attendance for {selectedRotation}{selectedPeriod} {attendance.date.month}/{attendance.date.day}/{attendance.date.year}
            </h2>

            <h3 class="font-bold">Present Students</h3>
            <ul>
                {attendance.presentStudents.map((student, index) => (
                    <li key={`present-${index}`}>{student.name} at {student.timestamp}</li>
                ))}
            </ul>

            <h3 class="font-bold">Absent Students</h3>
            <ul>
                {attendance.absentStudents.map((student, index) => (
                    <li key={`absent-${index}`}>{student.name}</li>
                ))}
            </ul>

            {/* <div className="mt-4 flex gap-3">
                <button
                    onClick={downloadSingleCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Download This Class CSV
                </button>

                <button
                    onClick={downloadAllForDateCSV}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Download All Classes for This Day
                </button>
            </div> */}
        </div>
    );
}

export default AttendanceData