import { useLocation } from "react-router";
import { useNavigate } from "react-router"
import AttendanceData from "../components/AttendanceData.jsx";

const ClassData = () => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white";
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj } = location.state || {};

    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }

    const handleContinueBack = () => {
        navigate("/classselection", {
            state: { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj }
        });
    };

    return (
        <>
            <AttendanceData
                selectedDate={selectedDate}
                selectedRotation={selectedRotation}
                selectedPeriod={selectedPeriod}
                selectedDateTypeObj={selectedDateTypeObj}
            />
            <button className={baseClass} onClick={() => handleContinueBack()}>
                Go Back  
            </button>
        </>
    );
};

export default ClassData;
