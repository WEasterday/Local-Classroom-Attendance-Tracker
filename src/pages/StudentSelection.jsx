import { useLocation } from "react-router";
import { useEffect } from "react"
import ClassOrganization from "../components/ClassOrganization.jsx";
import classData from "../assets/ClassData.json";

const StudentSelection = () => {
    const location = useLocation();
    
    const { selectedRotation, selectedPeriod } = location.state || {};
    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }

    // handles if a student accidentally refreshes 
    useEffect(() => {
        sessionStorage.setItem("inStudentSelection", "true")

        return () => {
        sessionStorage.removeItem("inStudentSelection");
        };
    }, [])

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
            />
        </div>
    );
};

export default StudentSelection;
