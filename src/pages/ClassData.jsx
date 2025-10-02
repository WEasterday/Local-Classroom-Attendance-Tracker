import { useLocation } from "react-router";
import AttendanceData from "../components/AttendanceData.jsx";

const ClassData = () => {
    const location = useLocation();
    const { selectedRotation, selectedPeriod, selectedDate } = location.state || {};

    if (!selectedRotation || !selectedPeriod) {
        return <p>No class selected. Go back to home.</p>;
    }

    return (
        <AttendanceData
            selectedDate={selectedDate}
            selectedRotation={selectedRotation}
            selectedPeriod={selectedPeriod}
        />
    );
};

export default ClassData;
