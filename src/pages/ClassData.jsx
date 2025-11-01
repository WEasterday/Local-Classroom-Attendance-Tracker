import { useLocation } from "react-router";
import { useNavigate } from "react-router"
import AttendanceData from "../components/AttendanceData.jsx";
import { downloadAttendanceCSV } from "../utils/downloadAttendance";
import { formatDateKey } from "../utils/dateUtils";

const ClassData = () => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white w-1/2";
    
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj } = location.state || {};

    const dateKey = formatDateKey(selectedDate);
    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    const attendance = stored[selectedRotation]?.[selectedPeriod]?.[dateKey] || null;

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
            <div className="flex w-full fixed bottom-0 mt-4 gap-1">
                <button 
                    className={baseClass} 
                    onClick={() => handleContinueBack()}
                >
                    Go Back  
                </button>
                <button
                    onClick={() =>
                        downloadAttendanceCSV(attendance, selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj)
                    }
                    className={baseClass}
                >
                    Download This Class CSV
                </button>
            </div>
        </>
    );
};

export default ClassData;
