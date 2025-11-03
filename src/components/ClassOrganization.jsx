import { useState, useEffect } from "react";
import { calendarDateToObject, formatDateKey, getTodayDate, getCurrentTime } from "../utils/dateUtils";
import RippleButton from "./ripple-button";

const ClassOrganization = ({ classInfo, selectedPeriod, selectedRotation, selectedDate, selectedDateTypeObj }) => {
    const buildClassKey = (rotation, period, date) => `${rotation}-${period}-${formatDateKey(date)}`;
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [selectedStudents, setSelectedStudents] = useState(() => {
        const day = selectedDate || getTodayDate();
        const classKey = buildClassKey(selectedRotation, selectedPeriod, day);

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
        
        const enrichmentMergedRecord =
            selectedPeriod.toLowerCase().includes("enrichment")
                ? {
                    ...(stored?.["A"]?.[selectedPeriod]?.[formatDateKey(day)] || {}),
                    ...(stored?.["B"]?.[selectedPeriod]?.[formatDateKey(day)] || {}),
                }
                : {};

        const existingRecord =
            enrichmentMergedRecord.presentStudents || enrichmentMergedRecord.absentStudents
                ? enrichmentMergedRecord
                : stored?.[selectedRotation]?.[selectedPeriod]?.[formatDateKey(day)] || {};

        const existingStudents = [
            ...(existingRecord.presentStudents || []),
            ...(existingRecord.absentStudents?.filter(absentStudent => absentStudent.note === "FLAGGED") || []),
        ];

        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        const tempStudents = tempStorage[classKey] || [];

        const merged = [...existingStudents];
        tempStudents.forEach((student) => {
            if (!merged.some((existingStudent) => existingStudent.name === student.name)) merged.push(student);
        });

        return merged;
    });
    
    // Save temp students on change
    useEffect(() => {
        const day = selectedDate || getTodayDate();
        const classKey = buildClassKey(selectedRotation, selectedPeriod, day);

        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        tempStorage[classKey] = selectedStudents;
        sessionStorage.setItem("selectedStudentsTemp", JSON.stringify(tempStorage));
    }, [selectedStudents, selectedRotation, selectedPeriod, selectedDate]);

    useEffect(() => {
        const day = selectedDate || getTodayDate();
        const dateKey = formatDateKey(day);

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
        
        const record = selectedPeriod.toLowerCase().includes("enrichment")
            ? {
                ...(stored?.["A"]?.[selectedPeriod]?.[dateKey] || {}),
                ...(stored?.["B"]?.[selectedPeriod]?.[dateKey] || {}),
            }
            : stored?.[selectedRotation]?.[selectedPeriod]?.[dateKey];
    }, [refreshTrigger, selectedPeriod, selectedRotation, selectedDate]);

    const playSound = (studentSound) => {
        const audio = studentSound
            ? new Audio(studentSound)
            : new Audio("src/assets/mixkit-mouse-click-close-1113.wav");
        audio.play();
    };

    const handleClassEntry = (studentName) => {
        // const currentTime = getCurrentTime();

        // for testing go to 1 Hour Day, 6th Grade
        const now = new Date();

        now.setHours(12);
        now.setMinutes(48);
        now.setSeconds(0);

        const currentTime = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        const day = selectedDate || getTodayDate();

        const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
        const existingRecord =
            stored?.[selectedRotation]?.[selectedPeriod]?.[formatDateKey(day)] || {};

        const alreadySubmittedNames = (existingRecord.presentStudents || [])
            .filter(student => student.note !== "FLAGGED")
            .map(student => student.name);

        setSelectedStudents((prev) => {
            const isSubmitted = alreadySubmittedNames.includes(studentName);
            const isTempSelected = prev.some((student) => student.name === studentName && !isSubmitted);

            if (isSubmitted) return prev;

            if (isTempSelected) {
                return prev.filter((student) => student.name !== studentName);
            }

            return [...prev, { name: studentName, timestamp: currentTime }];
        });
    };

    const isStudentInPeriod = (periodName, student) => {
        const { start: periodStart, end: periodEnd } = selectedDateTypeObj[periodName];
        if (!periodStart || !periodEnd) return false;
        if (!student.timestamp || typeof student.timestamp !== "string") return false;

        const [timePart, modifier] = student.timestamp.split(" ");
        const [hourStr, minuteStr, secondStr] = timePart.split(":");
        const hour = (modifier === "PM" && Number(hourStr) < 12)
            ? Number(hourStr) + 12
            : (modifier === "AM" && Number(hourStr) === 12)
                ? 0
                : Number(hourStr);
        const minute = Number(minuteStr);
        const second = Number(secondStr) || 0;

        const studentTime = new Date();
        studentTime.setHours(hour, minute, second, 0);

        const parsePeriodTime = (timeStr) => {
            const [h, m] = timeStr.split(":").map(Number);
            const hr = (h < 7) ? h + 12 : h; // 1–6 treated as pm
            const date = new Date();
            date.setHours(hr, m, 0, 0);
            return date;
        };

        const startTime = parsePeriodTime(periodStart);
        const endTime = parsePeriodTime(periodEnd);

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

        // Split on-time vs flagged
        const onTimeStudents = selectedForThisClass.filter(student =>
            isStudentInPeriod(selectedPeriod, student)
        );

        const flaggedStudents = selectedForThisClass
            .filter(student => 
                !isStudentInPeriod(selectedPeriod, student) && 
                !onTimeStudents.some(flagged => flagged.name === student.name)
            ) 
            .map(student => ({
                name: student.name,
                timestamp: student.timestamp,
                note: "FLAGGED",
            }));

        // Absent students = not selected and note flagged students (with note)
        const absentStudents = currentClassStudents
            .filter(currentStudent =>
                !onTimeStudents.some(onTime => onTime.name === currentStudent.name) &&
                !flaggedStudents.some(flagged => flagged.name === currentStudent.name)
            )
            .map(currentStudent => ({
                name: currentStudent.name,
                timestamp: null,
            }));

        const finalAbsentStudents = [...flaggedStudents, ...absentStudents];

        stored[selectedRotation][selectedPeriod][dateKey] = {
            date: calendarDateToObject(day),
            selectedRotation,
            selectedPeriod,
            selectedDateTypeObj,
            presentStudents: onTimeStudents,
            absentStudents: finalAbsentStudents,
        };

         if (selectedPeriod.toLowerCase().includes("enrichment")) {
            ["A", "B"].forEach((rotation) => {
                if (!stored[rotation]) stored[rotation] = {};
                if (!stored[rotation][selectedPeriod]) stored[rotation][selectedPeriod] = {};
                stored[rotation][selectedPeriod][dateKey] = stored[selectedRotation][selectedPeriod][dateKey];
            });
        }

        // Remove submitted students from temp storage
        const tempStorage = JSON.parse(sessionStorage.getItem("selectedStudentsTemp")) || {};
        if (tempStorage[classKey]) {
            tempStorage[classKey] = tempStorage[classKey].filter(
                (student) => !selectedForThisClass.some((submitted) => submitted.name === student.name)
            );
            sessionStorage.setItem("selectedStudentsTemp", JSON.stringify(tempStorage));
        }

        localStorage.setItem("attendanceRecords", JSON.stringify(stored));
        setRefreshTrigger(prev => prev + 1);
    };

    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const day = selectedDate || getTodayDate();
    const dateKey = formatDateKey(day);

    const record = selectedPeriod.toLowerCase().includes("enrichment")
        ? {
              ...(stored?.["A"]?.[selectedPeriod]?.[dateKey] || {}),
              ...(stored?.["B"]?.[selectedPeriod]?.[dateKey] || {}),
          }
        : stored?.[selectedRotation]?.[selectedPeriod]?.[dateKey];

    return (
        <div className="flex flex-col items-center gap-4">
            <RippleButton
                onClick={() => {
                    submitClassAttendance(); 
                    playSound();
                }}
                rippleClassName="bg-white/50"
                className="absolute top-0 left-0 size-6 bg-transparent hover:bg-transparent"
            />
            <div className="flex flex-wrap justify-center gap-3">
                {classInfo.students.map((student, index) => {
                    const isSubmitted = record?.presentStudents
                        ?.filter((presentStudent) => presentStudent.note !== "FLAGGED")
                        ?.some((presentStudent) => presentStudent.name === student.name);

                    const isFlagged = record?.absentStudents
                        ?.some((absentStudent) => absentStudent.name === student.name && absentStudent.note === "FLAGGED");

                    const isSelected = selectedStudents.some((selectedStudent) => selectedStudent.name === student.name);

                    return (
                        <RippleButton
                            key={`${classInfo.period}-${student.name}-${index}`}
                            disabled={isSubmitted || isFlagged}
                            onClick={() => {
                                if (!isSubmitted && !isFlagged) {
                                    handleClassEntry(student.name);
                                    playSound(student.sound);
                                }
                            }}
                            className={`w-44 h-20 text-center font-semibold text-white ${
                                isSubmitted
                                    ? "cursor-not-allowed bg-lightGray"
                                    : isFlagged
                                        ? "bg-redMain" 
                                        : isSelected
                                            ? "bg-black hover:bg-black"
                                            : "bg-baseOrange hover:bg-darkOrange"
                            }`}
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

