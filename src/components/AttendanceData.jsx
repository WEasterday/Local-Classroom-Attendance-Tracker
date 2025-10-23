import { formatDateKey } from "../utils/dateUtils";

const AttendanceData = ({ selectedDate, selectedPeriod, selectedRotation }) => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white"
    const dateKey = formatDateKey(selectedDate);
    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const attendance = stored[selectedRotation]?.[selectedPeriod]?.[dateKey] || null;

    console.log("stored:", stored)

    const downloadSingleCSV = () => {
        const allStudents = [
            ...attendance.presentStudents.map(s => ({
                Name: s.name,
                Status: "Present",
                Timestamp: s.timestamp || "",
            })),
            ...attendance.absentStudents.map(s => ({
                Name: s.name,
                Status: "Absent",
                Timestamp: "",
            })),
        ];

        // add todays date, period, and rotation
        const headers = ["Name", "Status", "Timestamp"];
        const rows = allStudents.map(student => [
            student.Name,
            student.Status,
            student.Timestamp,
        ]);

        // figure out why timestamp is ###### in excel
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Attendance_${selectedRotation}_${selectedPeriod}_${dateKey}.csv`;
        link.click();
    };

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

            <div className="mt-4 flex gap-3">
                <button
                    onClick={downloadSingleCSV}
                    className={baseClass}
                >
                    Download This Class CSV
                </button>

                {/* <button
                    onClick={downloadAllForDateCSV}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Download All Classes for This Day
                </button> */}
            </div>
        </div>
    );
}

export default AttendanceData