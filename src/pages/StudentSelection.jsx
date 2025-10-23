import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react"
import RippleButton from "../components/ripple-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ClassOrganization from "../components/ClassOrganization.jsx";
import classData from "../assets/ClassData.json";

const StudentSelection = ({isAdmin}) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { selectedRotation, selectedPeriod, selectedDate } = location.state || {};

    const classesForRotation = classData[selectedRotation];
    const periodNumbers = classesForRotation.map(classPeriod => classPeriod.period).sort((a, b) => a - b);
    const currentIndex = periodNumbers.indexOf(selectedPeriod);
    
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < periodNumbers.length - 1;

    const prevPeriod = hasPrev ? periodNumbers[currentIndex - 1] : null;
    const nextPeriod = hasNext ? periodNumbers[currentIndex + 1] : null;

    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }

    // handles if a student accidentally refreshes 
    useEffect(() => {
        sessionStorage.setItem("inStudentSelection", "true");

        return () => {
            sessionStorage.removeItem("inStudentSelection");
        };
    }, [])

    const handleContinueBack = () => {
        navigate("/classselection", {
            state: { selectedRotation, selectedPeriod, selectedDate }
        });
    };

    const selectedClass = classData[selectedRotation].find(
        (classObj) => classObj.period === selectedPeriod
    );

    return (
        <div className="flex flex-col justify-center items-center gap-8 min-h-screen text-center">
            {/* could definitely make this into a component */}
            <div className="flex flex-row justify-center items-center gap-8 w-full">
                {hasPrev ? (
                    <RippleButton
                        variant="default"
                        size="sm"
                        className="flex flex-row justify-center items-center h-8 transition-colors bg-baseOrange hover:bg-darkOrange"
                        onClick={() =>
                            navigate("/students", {
                                state: { 
                                    selectedRotation, 
                                    selectedPeriod: prevPeriod, 
                                    selectedDate 
                                }
                            })
                        }
                    >
                        <ArrowLeft className="size-4"/> 
                        <p className="text-xs mr-1">Period {prevPeriod}</p>
                    </RippleButton>
                ) : (
                    <div className="h-8 w-23"/>
                )}

                <h2 className="text-center text-lg font-semibold">{selectedRotation} Day - Period {selectedPeriod}</h2>

                {hasNext ? (
                    <RippleButton
                        variant="default"
                        size="sm"
                        className="flex flex-row justify-center items-center h-8 transition-colors bg-baseOrange hover:bg-darkOrange"
                        onClick={() =>
                            navigate("/students", {
                                state: { 
                                    selectedRotation, 
                                    selectedPeriod: nextPeriod, 
                                    selectedDate 
                                }
                            })
                        }
                    >
                        <p className="text-xs ml-1">Period {nextPeriod}</p>
                        <ArrowRight className="size-4"/> 
                    </RippleButton>
                ) : (
                    <div className="h-8 w-23"/>
                )}
            </div>
            <ClassOrganization
                classInfo={selectedClass}
                selectedPeriod={selectedPeriod}
                selectedRotation={selectedRotation}
                selectedDate={selectedDate}
            />
            <footer className="flex w-full absolute bottom-0">
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
