import { useState, useEffect } from 'react'
import { useLocation } from "react-router";
import { useNavigate } from "react-router"
import DateTypeController from '../components/DateTypeController.jsx'
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
    const [selectedDate, setSelectedDate] = useState(
        location.state?.selectedDate || getTodayDate()
    );
    const [selectedPeriod, setSelectedPeriod] = useState(
        location.state?.selectedPeriod || "8th Grade"
    );
    const [selectedDateTypeObj, setSelectedDateTypeObj] = useState( 
        location.state?.selectedDateTypeObj || 
        {
            "description": "Normal",
            "6th Grade": { start: "10:29", end: "11:24"},
            "7th Grade": { start: "9:31", end: "10:26"},
            "8th Grade": { start: "8:33", end: "9:28"},
            "Enrichment": { start: "1:05", end: "1:35"},
        }
    );
    
    const selectedDay = classData[selectedRotation];

    const handleContinue = () => {
        navigate("/students", {
            state: { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj }
        });
    };

    const handleContinueToData = () => {
        navigate("/classdata", {
            state: { selectedRotation, selectedPeriod, selectedDate, selectedDateTypeObj }
        });
    };

    return (
        <div className="flex flex-col items-center mx-auto mt-10 p-6 gap-4 sm:p-10 max-w-lg w-full border rounded-2xl shadow-lg bg-white">
            <DateTypeController
                selectedDateTypeObj={selectedDateTypeObj}
                setSelectedDateTypeObj={setSelectedDateTypeObj}
            />
            <RotationController
                selectedRotation={selectedRotation}
                setSelectedRotation={setSelectedRotation}
                selectedDay={selectedDay}
            />
            <PeriodController
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                selectedDay={selectedDay}
                selectedDateTypeObj={selectedDateTypeObj}
            />
            <div className="flex flex-col items-center w-full gap-5">
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
