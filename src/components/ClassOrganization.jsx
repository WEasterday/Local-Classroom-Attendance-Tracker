import { useState } from "react";
import { calendarDateToObject, formatDateKey, getTodayDate } from "../utils/dateUtils";

const ClassOrganization = ({ classInfo, selectedPeriod, selectedRotation }) => {

    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleClassEntry = (studentName) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        setSelectedStudents((prev) => {
            const exists = prev.find((studentObj) => studentObj.name === studentName)

            if (exists) {
                return prev.filter((studentObj) => studentObj.name !== studentName);
            } else {
                return [...prev, {name: studentName, timestamp: currentTime}];
            }
        });
    };

    const submitClassAttendance = () => {
        const today = getTodayDate();
        const dateKey = formatDateKey(today);

        const absentStudents = (classInfo?.students || []).filter(
            (studentObj) => !selectedStudents.some((selectedStudentObj) => selectedStudentObj.name === studentObj.name)
        ).map((studentObj) => ({ name: studentObj.name, timestamp: null }));

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

        if (!stored[selectedRotation]) stored[selectedRotation] = {};
        if (!stored[selectedRotation][selectedPeriod]) stored[selectedRotation][selectedPeriod] = {};

        const existingRecord = stored[selectedRotation][selectedPeriod][dateKey]

        if(existingRecord){
            const mergedPresent = [...existingRecord.presentStudents];

            selectedStudents.forEach((studentObj) => {
                const alreadySubmitted = mergedPresent.some((presentStudentObj) => presentStudentObj.name == studentObj.name)
                if (!alreadySubmitted) {
                    mergedPresent.push(studentObj);
                }
            })

            const mergedAbsent = [
                // checks that students arent both in absent and present, if they are remove them from absent
                ...existingRecord.absentStudents.filter(
                    (absentStudentObj) => !mergedPresent.some((presentStudentObj) => presentStudentObj.name === absentStudentObj.name)
                ),
                // keeps only people who are not marked present and people who are not already on the absent list
                ...absentStudents.filter(
                    (absentStudentObj) =>
                        !mergedPresent.some((presentStudentObj) => presentStudentObj.name === absentStudentObj.name) &&
                        !existingRecord.absentStudents.some((existingAbsentStudentObj) => existingAbsentStudentObj.name === absentStudentObj.name)
                ),
            ];  

            stored[selectedRotation][selectedPeriod][dateKey] = {
                ...existingRecord,
                presentStudents: mergedPresent,
                absentStudents: mergedAbsent,
            };

            console.log(mergedPresent)
        }

        else{
            const attendanceRecord = {
                date: calendarDateToObject(today),
                selectedRotation,
                selectedPeriod,
                presentStudents: selectedStudents,
                absentStudents: absentStudents
            };

            stored[selectedRotation][selectedPeriod][dateKey] = attendanceRecord;
        }

        localStorage.setItem("attendanceRecords", JSON.stringify(stored));
    }

    return (
        <div>
            <ul id="student-list">
                {classInfo.students.map((student, index) => {
                    const isSelected = selectedStudents.some(
                        (studentObj) => studentObj.name === student.name
                    );

                    return(
                        <li
                            key={`${classInfo.period}-${student.name}-${index}`}
                            className={`student-item ${isSelected ? "selected" : ""}`}
                            onClick={() => handleClassEntry(student.name)}
                        >
                            {student.name}
                        </li>
                    );
                })}
            </ul>
            <button onClick={() => submitClassAttendance()}>submit</button>
        </div>
    );
}

export default ClassOrganization;