import { useState } from 'react'
import { useNavigate } from "react-router"
import PeriodController from '../components/PeriodController.jsx'
import DateController from '../components/DateController.jsx'
import RotationController from '../components/RotationController.jsx'
import classData from '../assets/ClassData.json'
import { getTodayDate } from "../utils/dateUtils";

const ClassSelection = ({isAdmin}) => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-sky-500 hover:bg-sky-600 text-white";
    const [selectedRotation, setSelectedRotation] = useState('A');
    const [selectedPeriod, setSelectedPeriod] = useState(1);  
    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    const navigate = useNavigate();
    const selectedDay = classData[selectedRotation];

    const handleContinue = () => {
        navigate("/students", {
            state: { selectedRotation, selectedPeriod }
        });
    };

    const handleContinueToData = () => {
        navigate("/classdata", {
            state: { selectedRotation, selectedPeriod, selectedDate }
        });
    };

    return (
        <>
            <RotationController
                selectedRotation={selectedRotation}
                setSelectedRotation={setSelectedRotation}
                selectedDay={selectedDay}
            />
            <PeriodController
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                selectedDay={selectedDay}
            />
            <div>
                {isAdmin && (
                    <DateController
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                )}

                <button className={baseClass} onClick={() => handleContinue()}>
                    Continue
                </button>
                {isAdmin && (
                    <button className={baseClass} onClick={() => handleContinueToData()}>
                        View Class Data
                    </button>
                )}
            </div>
        </>
    );
};

export default ClassSelection;
