import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react"
import RippleButton from "../components/ripple-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ClassOrganization from "../components/ClassOrganization.jsx";
import classData from "../assets/ClassData.json";
import { calendarDateToObject } from "../utils/dateUtils";

const StudentSelection = ({isAdmin}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj } = location.state || {};

    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }
    
    let jsDate;
    try {
        const { year, month, day } = calendarDateToObject(selectedDate);
        jsDate = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    } catch {
        jsDate = new Date();
    }
    const isWednesday = jsDate.getDay() === 3;

    const periodNumbers = Object.keys(selectedDateTypeObj)
        .filter((period) => {
            if (period === "description") return false;
            const hasTimes = selectedDateTypeObj[period]?.start;

            if (!hasTimes) return false;
            if (isWednesday && period === "Enrichment") return false;
            if (!isWednesday && period === "Compass") return false;

            return true;
        })
        .sort((a, b) => {
            const [h1, m1] = selectedDateTypeObj[a].start.split(":").map(Number);
            const [h2, m2] = selectedDateTypeObj[b].start.split(":").map(Number);
            const normalizeHour = (h) => (h < 4 ? h + 12 : h);
            return normalizeHour(h1) * 60 + m1 - (normalizeHour(h2) * 60 + m2);
        });

    if (isWednesday && !periodNumbers.includes("Compass")) {
        periodNumbers.push("Compass");
    }
    
    const currentIndex = periodNumbers.indexOf(selectedPeriod);
    
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < periodNumbers.length - 1;

    const prevPeriod = hasPrev ? periodNumbers[currentIndex - 1] : null;
    const nextPeriod = hasNext ? periodNumbers[currentIndex + 1] : null;

    

    // handles if a student accidentally refreshes 
    // I need to make it so it keeps the permissions of the user, 
    // so if an admin refreshes they stay an admin
    useEffect(() => {
        sessionStorage.setItem("inStudentSelection", "true");

        return () => {
            sessionStorage.removeItem("inStudentSelection");
        };
    }, [])

    const handleContinueBack = () => {
        navigate("/classselection", {
            state: { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj }
        });
    };

    const selectedClass = classData[selectedRotation].find(
        (classObj) => classObj.period === selectedPeriod
    );

    return (
        <div className="flex flex-col items-center gap-6 text-center min-h-screen justify-start sm:justify-center pt-8">
            {/* could definitely make this into a component */}
            {(selectedDateTypeObj.description != "Normal" && (
                <div>
                    <h1 className="text-lg font-semibold">
                        {selectedDateTypeObj.description} Day Schedule
                    </h1>
                    <h1 className="text-md font-semibold">
                        {selectedDateTypeObj[selectedPeriod].start} - {selectedDateTypeObj[selectedPeriod].end}
                    </h1>
                </div>

            ))}
            <div className="flex flex-row justify-center items-center gap-8 w-full">
                {hasPrev ? (
                    <RippleButton
                        variant="default"
                        size="sm"
                        className="flex flex-row justify-center items-center h-8 w-25 transition-colors bg-baseOrange hover:bg-darkOrange"
                        onClick={() =>
                            navigate("/students", {
                                state: { 
                                    selectedRotation, 
                                    selectedPeriod: prevPeriod, 
                                    selectedDate,
                                    selectedDateTypeObj
                                }
                            })
                        }
                    >
                        <ArrowLeft className="size-4"/> 
                        <p className="text-xs mr-1">{prevPeriod}</p>
                    </RippleButton>
                ) : (
                    <div className="h-8 w-23"/>
                )}

                <h2 className="text-center text-lg font-semibold">{selectedRotation} Day - {selectedPeriod}</h2>

                {hasNext ? (
                    <RippleButton
                        variant="default"
                        size="sm"
                        className="flex flex-row justify-center items-center h-8 w-25 transition-colors bg-baseOrange hover:bg-darkOrange"
                        onClick={() =>
                            navigate("/students", {
                                state: { 
                                    selectedRotation, 
                                    selectedPeriod: nextPeriod, 
                                    selectedDate,
                                    selectedDateTypeObj
                                }
                            })
                        }
                    >
                        <p className="text-xs ml-1">{nextPeriod}</p>
                        <ArrowRight className="size-4"/> 
                    </RippleButton>
                ) : (
                    <div className="h-8 w-23"/>
                )}
            </div>
            <div className="min-h-fit pb-20">
                <ClassOrganization
                    classInfo={selectedClass}
                    selectedPeriod={selectedPeriod}
                    selectedRotation={selectedRotation}
                    selectedDate={selectedDate}
                    selectedDateTypeObj={selectedDateTypeObj}
                />
            </div>
            <footer className="flex w-full fixed bottom-0">
                {isAdmin && (
                    <button className={`px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white w-full`} onClick={() => handleContinueBack()}>
                        Go Back
                    </button>
                )}
            </footer>
        </div>
    );
};

export default StudentSelection;
