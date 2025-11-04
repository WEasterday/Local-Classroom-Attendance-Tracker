import { formatDateKey, getWeekRange } from "./dateUtils";
import classData from "../assets/ClassData.json";

const escapeCSV = (value) => {
  if (value == null) return "";
  const newValue = value.toString();
  return newValue.includes(",") || newValue.includes('"')
    ? `"${newValue.replace(/"/g, '""')}"`
    : newValue;
};

export const downloadAttendanceCSV = (
    attendance,
    selectedRotation,
    selectedPeriod,
    selectedDate
) => {
    if (!attendance) return;

    const dateKey = formatDateKey(selectedDate);
    const { month, day, year } = attendance.date;
    const scheduleType = attendance.selectedDateTypeObj?.description || "Unknown Schedule";
    const daySchedule = (attendance.selectedDateTypeObj) || {};
    const startTime = daySchedule[selectedPeriod].start || "N/A";
    const endTime = daySchedule[selectedPeriod].end || "N/A";

    // important data
    const metaRows = [
        ["Class Attendance Report"],
        ["Rotation (Day Type):", selectedRotation],
        ["Period:", selectedPeriod],
        ["Schedule Type:", scheduleType],
        ["Class Time:", `${startTime} - ${endTime}`],
        ["Date:", `${month}/${day}/${year}`],
        [],
    ];

    // students
    const allStudents = [
        ...attendance.presentStudents.map((student) => ({
        Name: student.name,
        Status: "Present",
        Timestamp: student.timestamp || "",
        Note: student.note || "",
        })),
        ...attendance.absentStudents.map((student) => ({
        Name: student.name,
        Status: student.note === "FLAGGED" ? "Late/Flagged" : "Absent",
        Timestamp: student.timestamp || "",
        Note: student.note || "",
        })),
    ];

    const headers = ["Name", "Status", "Timestamp", "Note"];
    const rows = allStudents.map((student) => [
        student.Name,
        student.Status,
        student.Timestamp,
        student.Note,
    ]);

    const csvContent = [
        ...metaRows.map((r) => r.map(escapeCSV).join(",")),
        headers.map(escapeCSV).join(","),
        ...rows.map((r) => r.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Attendance_${selectedRotation}_${selectedPeriod}_${dateKey}.csv`;
    link.click();
};

export const downloadWeeklyAttendanceCSV = (selectedDate) => {
    const { monday, friday } = getWeekRange(selectedDate);
    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const currentDate = new Date(monday);

    const escapeCSV = (value) => {
        if (value == null) return "";
        const str = value.toString();
        return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const getRotationForDate = (dateKey) => {
        for (const rotationKey of Object.keys(attendanceRecords)) {
            const rotationData = attendanceRecords[rotationKey];
            for (const periodKey of Object.keys(rotationData)) {
                if (rotationData[periodKey]?.[dateKey]) return rotationKey;
            }
        }
        const day = new Date(dateKey).getDay();
        return day % 2 === 0 ? "B" : "A";
    };

    let csvContent = "";

    for (let i = 0; i < 5; i++) {
        const dateKey = formatDateKey({
            month: (currentDate.getMonth() + 1).toString().padStart(2, "0"),
            day: currentDate.getDate().toString().padStart(2, "0"),
            year: currentDate.getFullYear(),
        });

        const rotation = getRotationForDate(dateKey);
        const rotationClasses = classData[rotation] || [];

        let dayType = "Normal";
        for (const { period } of rotationClasses) {
            const record = attendanceRecords?.[rotation]?.[period]?.[dateKey];
            if (record?.selectedDateTypeObj?.description) {
                dayType = record.selectedDateTypeObj.description;
                break;
            }
        }

        const isWednesday = currentDate.getDay() === 3;

        const effectiveClasses = rotationClasses.filter(({ period }) => {
            const lower = period.toLowerCase();
            if (isWednesday && lower === "enrichment") return false;
            if (!isWednesday && lower === "compass") return false;
            return true;
        });

        // Check if any class has submissions for this day
        const anyClassSubmitted = effectiveClasses.some(({ period }) => {
            const record = attendanceRecords?.[rotation]?.[period]?.[dateKey];
            return record && ((record.presentStudents?.length || 0) + (record.absentStudents?.length || 0)) > 0;
        });

        // Date header
        csvContent += `\n--- ${currentDate.toDateString()} (${rotation} Day) ---\n`;
        csvContent += `Day Type: ${dayType}\n`;

        if (!anyClassSubmitted) {
            csvContent += `No class data for any class on this day\n`;
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        effectiveClasses.forEach(({ period, students }) => {
            if (period.toLowerCase() === "enrichment" && dayType !== "Normal") return;
            if (period.toLowerCase() === "compass" && dayType !== "Normal") return;

            // Get period schedule from selectedDateTypeObj
            const daySchedule = attendanceRecords?.[rotation]?.[period]?.[dateKey]?.selectedDateTypeObj || {};
            const periodSchedule = daySchedule[period] || {};
            const startTime = periodSchedule.start || "N/A";
            const endTime = periodSchedule.end || "N/A";

            csvContent += `\nPeriod: ${period} (${startTime} - ${endTime})\n`;

            // Get attendance for this period/date
            let classAttendance = attendanceRecords?.[rotation]?.[period]?.[dateKey] || { presentStudents: [], absentStudents: [] };

            if (period.toLowerCase() === "enrichment") {
                const otherRotation = rotation === "A" ? "B" : "A";
                const otherRecord = attendanceRecords?.[otherRotation]?.[period]?.[dateKey] || { presentStudents: [], absentStudents: [] };

                otherRecord.presentStudents.forEach(s => {
                    if (!classAttendance.presentStudents.some(ps => ps.name === s.name)) classAttendance.presentStudents.push(s);
                });
                otherRecord.absentStudents.forEach(s => {
                    if (!classAttendance.absentStudents.some(as => as.name === s.name)) classAttendance.absentStudents.push(s);
                });
            }

            if (period.toLowerCase() === "compass") {
                const otherRotation = rotation === "A" ? "B" : "A";
                const otherRecord = attendanceRecords?.[otherRotation]?.[period]?.[dateKey] || { presentStudents: [], absentStudents: [] };

                otherRecord.presentStudents.forEach(s => {
                    if (!classAttendance.presentStudents.some(ps => ps.name === s.name)) classAttendance.presentStudents.push(s);
                });
                otherRecord.absentStudents.forEach(s => {
                    if (!classAttendance.absentStudents.some(as => as.name === s.name)) classAttendance.absentStudents.push(s);
                });
            }

            const recordMap = {};

            // Present students
            classAttendance.presentStudents.forEach(s => {
                recordMap[s.name] = {
                    status: "Present",
                    timestamp: s.timestamp || "—",
                    note: s.note || ""
                };
            });

            // Absent students
            classAttendance.absentStudents.forEach(s => {
                if (!recordMap[s.name]) {
                    recordMap[s.name] = {
                        status: "Absent",
                        timestamp: s.timestamp || "—",
                        note: s.note || ""
                    };
                }
            });

            if (Object.keys(recordMap).length > 0) {
                csvContent += "Date,Rotation,Period,Student,Status,Time,Notes,ClassTime\n";
                students.forEach(student => {
                    const rec = recordMap[student.name] || { status: "Absent", timestamp: "—", note: "" };
                    csvContent += [
                        escapeCSV(dateKey),
                        escapeCSV(rotation),
                        escapeCSV(period),
                        escapeCSV(student.name),
                        escapeCSV(rec.status),
                        escapeCSV(rec.timestamp),
                        escapeCSV(rec.note),
                        escapeCSV(`${startTime} - ${endTime}`)
                    ].join(",") + "\n";
                });
            } else {
                csvContent += `${escapeCSV(dateKey)},${escapeCSV(rotation)},${escapeCSV(period)},—,No class data,—,—,"${students.length} students expected"\n`;
            }
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    const startDate = monday.toLocaleDateString();
    const endDate = friday.toLocaleDateString();
    const fileName = `Attendance_Week_${startDate}_to_${endDate}.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};