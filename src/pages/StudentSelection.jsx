import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react"
import RippleButton from "../components/ripple-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ClassOrganization from "../components/ClassOrganization.jsx";
import classData from "../assets/ClassData.json";

const StudentSelection = ({isAdmin}) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj } = location.state || {};
    const periodNumbers = Object.keys(selectedDateTypeObj)
        .filter(period => period !== "description" && selectedDateTypeObj[period]?.start)
        .sort((a, b) => {
            const [h1, m1] = selectedDateTypeObj[a].start.split(":").map(Number);
            const [h2, m2] = selectedDateTypeObj[b].start.split(":").map(Number);
            const normalizeHour = h => (h < 4 ? h + 12 : h); // treat early hours as PM
            return (normalizeHour(h1) * 60 + m1) - (normalizeHour(h2) * 60 + m2); //subtracts minutes, eg. negative means item1 is first
        });
    const currentIndex = periodNumbers.indexOf(selectedPeriod);
    
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < periodNumbers.length - 1;

    const prevPeriod = hasPrev ? periodNumbers[currentIndex - 1] : null;
    const nextPeriod = hasNext ? periodNumbers[currentIndex + 1] : null;

    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }

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

    // something is wrong with saving the students
    // if you go to the first period, and submit, then go to the next period
    // the next periods selectedStudents is cleared sometimes

    // If I selected students in each class, then go back to the main page, go back in
    // submit the first class, the rest of the classes have their tempSelectedStudents cleared
    return (
        <div className="flex flex-col items-center gap-8 text-center min-h-screen justify-start sm:justify-center pt-8">
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
            <ClassOrganization
                classInfo={selectedClass}
                selectedPeriod={selectedPeriod}
                selectedRotation={selectedRotation}
                selectedDate={selectedDate}
                selectedDateTypeObj={selectedDateTypeObj}
            />
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
