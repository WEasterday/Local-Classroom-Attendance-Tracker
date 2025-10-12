import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react"
import ClassOrganization from "../components/ClassOrganization.jsx";
import classData from "../assets/ClassData.json";

const StudentSelection = ({isAdmin}) => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-black text-white";
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedRotation, selectedPeriod, selectedDate } = location.state || {};
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
        <div>
            <h2>{selectedRotation} Day - Period {selectedPeriod}</h2>
            <ClassOrganization
                classInfo={selectedClass}
                selectedPeriod={selectedPeriod}
                selectedRotation={selectedRotation}
                selectedDate={selectedDate}
            />
            {isAdmin && (
                <button className={baseClass} onClick={() => handleContinueBack()}>
                    Go Back
                </button>
            )}
        </div>
    );
};

export default StudentSelection;
