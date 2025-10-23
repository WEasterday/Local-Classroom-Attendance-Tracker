import { useState, useEffect } from "react";
import { calendarDateToObject, formatDateKey, getTodayDate } from "../utils/dateUtils";
import RippleButton from "./ripple-button";

const ClassOrganization = ({ classInfo, selectedPeriod, selectedRotation, selectedDate }) => {

    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        const day = selectedDate ? selectedDate : getTodayDate();
        const dateKey = formatDateKey(day);
        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

        const existingRecord = stored[selectedRotation]?.[selectedPeriod]?.[dateKey];
        if (existingRecord && existingRecord.presentStudents) {
            setSelectedStudents(existingRecord.presentStudents);
        }
    }, [selectedDate, selectedRotation, selectedPeriod]);

    const playSound = (studentSound) => {
        const audio = (studentSound) ? new Audio(studentSound) : new Audio("src/assets/mixkit-mouse-click-close-1113.wav");
        audio.play();
    };

    

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
        const day = selectedDate ? selectedDate : getTodayDate();
        const dateKey =  formatDateKey(day);

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
                date: calendarDateToObject(day),
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
        // save presently students in a seperate local storage in case of refresh
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
                {classInfo.students.map((student, index) => {
                    const isSelected = selectedStudents.some(
                        (studentObj) => studentObj.name === student.name
                    );

                    return (
                        <RippleButton
                            key={`${classInfo.period}-${student.name}-${index}`}
                            onClick={() => {
                                handleClassEntry(student.name);
                                playSound(student.sound);
                            }}
                            rippleClassName="bg-white/50"
                            variant={isSelected ? "outline" : "default"}
                            size="sm"
                            className={`w-36 h-18 text-center font-semibold transition-colors duration-400
                                ${isSelected
                                    ? "bg-black text-white"
                                    : "bg-baseOrange hover:bg-darkOrange text-white"
                                }`}
                            style={{
                                backgroundColor: !isSelected && student.background
                                    ? student.background
                                    : undefined,
                                color: !isSelected && student.text
                                    ? student.text
                                    : undefined,
                            }}
                        >
                            {student.name}
                        </RippleButton>
                    );
                })}
            </div>

            <RippleButton
                onClick={submitClassAttendance}
                rippleClassName="bg-white/50"
                className="mt-6 w-32 bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
            >
                Submit
            </RippleButton>
        </div>
    );
}

export default ClassOrganization;