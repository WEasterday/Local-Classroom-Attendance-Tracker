import { useState } from 'react'
import { useLocation } from "react-router";
import { useNavigate } from "react-router"
import PeriodController from '../components/PeriodController.jsx'
import DateController from '../components/DateController.jsx'
import RotationController from '../components/RotationController.jsx'
import classData from '../assets/ClassData.json'
import { getTodayDate } from "../utils/dateUtils";

const ClassSelection = ({isAdmin}) => {   
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white";
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedRotation, setSelectedRotation] = useState(
        location.state?.selectedRotation || 'A'
    );
    const [selectedPeriod, setSelectedPeriod] = useState(
        location.state?.selectedPeriod || 1
    );
    const [selectedDate, setSelectedDate] = useState(
        location.state?.selectedDate || getTodayDate()
    );

    const selectedDay = classData[selectedRotation];

    const handleContinue = () => {
        navigate("/students", {
            state: { selectedRotation, selectedPeriod, selectedDate }
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
            <div className="flex items-center flex-col p-5">
                {isAdmin && (
                    <DateController
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                )}

                <div className="flex justify-evenly gap-5 p-5">
                    <button className={baseClass} onClick={() => handleContinue()}>
                        Continue
                    </button>
                    {isAdmin && (
                        <button className={baseClass} onClick={() => handleContinueToData()}>
                            Class Data
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClassSelection;
