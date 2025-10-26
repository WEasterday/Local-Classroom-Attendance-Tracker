import { useState, useEffect } from "react";
import { calendarDateToObject, formatDateKey, getTodayDate, getCurrentTime } from "../utils/dateUtils";
import RippleButton from "./ripple-button";

const ClassOrganization = ({ classInfo, selectedPeriod, selectedRotation, selectedDate, selectedDateTypeObj }) => {
    const buildClassKey = (rotation, period, date) => `${rotation}-${period}-${formatDateKey(date)}`;

    const [selectedStudents, setSelectedStudents] = useState(() => {
        const day = selectedDate || getTodayDate();
        const classKey = buildClassKey(selectedRotation, selectedPeriod, day);

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
        const existingRecord = stored[selectedRotation]?.[selectedPeriod]?.[formatDateKey(day)];
        const existingStudents = existingRecord?.presentStudents || [];

        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        const tempStudents = tempStorage[classKey] || [];

        // Merge submitted and temp safely
        const mergedStudents = [...existingStudents];
        tempStudents.forEach((student) => {
            if (!mergedStudents.some((existing) => existing.name === student.name)) mergedStudents.push(student);
        });

        return mergedStudents;
    });
    
    // Save temp students on change
    useEffect(() => {
        const day = selectedDate || getTodayDate();
        const classKey = buildClassKey(selectedRotation, selectedPeriod, day);

        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        tempStorage[classKey] = selectedStudents;
        sessionStorage.setItem("selectedStudentsTemp", JSON.stringify(tempStorage));
    }, [selectedStudents, selectedRotation, selectedPeriod, selectedDate]);

    const playSound = (studentSound) => {
        const audio = studentSound
            ? new Audio(studentSound)
            : new Audio("src/assets/mixkit-mouse-click-close-1113.wav");
        audio.play();
    };

    const handleClassEntry = (studentName) => {
        const currentTime = getCurrentTime();

        setSelectedStudents((prev) => {
            const exists = prev.find((student) => student.name === studentName);
            if (exists) return prev.filter((student) => student.name !== studentName);
                return [...prev, { name: studentName, timestamp: currentTime }];
        });
    };

    const isStudentInPeriod = (periodName, student) => {
        const { start: periodStart, end: periodEnd } = selectedDateTypeObj[periodName];
        if (!periodStart || !periodEnd) return false;

        if (!student.timestamp || typeof student.timestamp !== "string") return false;
        const [timePart, modifier] = student.timestamp.split(" ");

        const [hourStr, minuteStr, secondStr] = timePart.split(":");
        const hour = (modifier === "PM" && Number(hourStr) < 12) ? Number(hourStr) + 12 : Number(hourStr);
        const minute = Number(minuteStr);
        const second = Number(secondStr) || 0;

        const studentTime = new Date();
        studentTime.setHours(hour, minute, second, 0);

        const startTime = new Date();
        startTime.setHours(...periodStart.split(":").map(Number), 0, 0);
        const endTime = new Date();
        endTime.setHours(...periodEnd.split(":").map(Number), 0, 0);

        return studentTime >= startTime && studentTime <= endTime;
    };

    const submitClassAttendance = () => {
        const day = selectedDate || getTodayDate();
        const dateKey = formatDateKey(day);
        const classKey = buildClassKey(selectedRotation, selectedPeriod, day);

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
        if (!stored[selectedRotation]) stored[selectedRotation] = {};
        if (!stored[selectedRotation][selectedPeriod]) stored[selectedRotation][selectedPeriod] = {};

        const currentClassStudents = classInfo?.students || [];

        // Filter selected students for this class
        const selectedForThisClass = selectedStudents.filter((student) =>
            currentClassStudents.some((current) => current.name === student.name)
        );

        // Split on-time vs late
        const onTimeStudents = selectedForThisClass.filter(student =>
            isStudentInPeriod(selectedPeriod, student)
        );

        const lateStudents = selectedForThisClass
            .filter(student => !isStudentInPeriod(selectedPeriod, student))
            .map(student => ({
                name: student.name,
                timestamp: student.timestamp,
                note: "FLAGGED",
            }));

        // Absent students = not selected and note late students (with note)
        const absentStudents = currentClassStudents
            .filter(currentStudent =>
                !onTimeStudents.some(onTime => onTime.name === currentStudent.name) &&
                !lateStudents.some(late => late.name === currentStudent.name)
            )
            .map(currentStudent => ({
                name: currentStudent.name,
                timestamp: null,
            }));

        const finalAbsentStudents = [...lateStudents, ...absentStudents];

        stored[selectedRotation][selectedPeriod][dateKey] = {
            date: calendarDateToObject(day),
            selectedRotation,
            selectedPeriod,
            presentStudents: onTimeStudents,
            absentStudents: finalAbsentStudents,
        };

        // Remove submitted students from temp storage
        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        if (tempStorage[classKey]) {
            tempStorage[classKey] = tempStorage[classKey].filter(
                (student) => !selectedForThisClass.some((submitted) => submitted.name === student.name)
            );
            sessionStorage.setItem("selectedStudentsTemp", JSON.stringify(tempStorage));
        }

        localStorage.setItem("attendanceRecords", JSON.stringify(stored));
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <RippleButton
                onClick={() => {
                    submitClassAttendance(); 
                    playSound();
                }}
                rippleClassName="bg-white/50"
                className="absolute top-0 left-0 size-6 bg-transparent hover:bg-black"
            />
            <div className="flex flex-wrap justify-center gap-3">
                {classInfo.students.map((student, index) => {
                    const isSelected = selectedStudents.some((s) => s.name === student.name);

                    return (
                        <RippleButton
                            key={`${classInfo.period}-${student.name}-${index}`}
                            onClick={() => {
                                handleClassEntry(student.name);
                                playSound(student.sound);
                            }}
                            rippleClassName="bg-white/80"
                            variant={isSelected ? "outline" : "default"}
                            size="sm"
                            className={`w-36 h-18 text-center font-semibold transition-colors duration-400
                                ${isSelected ? "bg-black text-white" : "bg-baseOrange hover:bg-darkOrange text-white"}`}
                            style={{
                                backgroundColor: !isSelected && student.background ? student.background : undefined,
                                color: !isSelected && student.text ? student.text : undefined,
                            }}
                        >
                            {student.name}
                        </RippleButton>
                    );
                })}
            </div>
        </div>
    );
};

export default ClassOrganization;
// make either a class clear button
// or a case for removing students
