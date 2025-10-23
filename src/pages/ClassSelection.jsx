import { useState } from 'react'
import { useLocation } from "react-router";
import { useNavigate } from "react-router"
import PeriodController from '../components/PeriodController.jsx'
import DateController from '../components/DateController.jsx'
import RotationController from '../components/RotationController.jsx'
import classData from '../assets/ClassData.json'
import { getTodayDate } from "../utils/dateUtils";


const ClassSelection = ({isAdmin}) => {   
    const baseClass = "px-6 py-2 rounded-xl font-semibold transition-colors bg-baseOrange hover:bg-darkOrange text-white shadow-sm";
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
        <div className="flex flex-col items-center mx-auto mt-10 p-6 sm:p-10 max-w-lg w-full border rounded-2xl shadow-lg bg-white">
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
            <div className="flex flex-col items-center w-full gap-5 mt-4">
                {isAdmin && (
                    <DateController
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                )}

                <div className="flex flex-wrap justify-center gap-4">
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
        </div>
    );
};

export default ClassSelection;
