import RippleButton from "./ripple-button";

const DateTypeController = ({ selectedDateTypeObj, setSelectedDateTypeObj }) => {

    const getDayTypeObj = (dateType) => {
        switch(dateType){
            case "Normal":
                setSelectedDateTypeObj({
                    description: "Normal",
                    "6th Grade": { start: "10:29", end: "11:24" },
                    "7th Grade": { start: "9:31", end: "10:26" },
                    "8th Grade": { start: "8:33", end: "9:28" },
                    "Enrichment": { start: "1:05", end: "1:35" },
                });
                break;
            case "1 Hour":
                setSelectedDateTypeObj({
                    description: "1 Hour",
                    "6th Grade": { start: "12:47", end: "1:42" },
                    "7th Grade": { start: "10:16", end: "11:06" },
                    "8th Grade": { start: "9:32", end: "10:13" },
                    "Enrichment": { start: null, end: null },
                });
                break;
            case "2 Hour":
                setSelectedDateTypeObj({
                    description: "2 Hour",
                    "6th Grade": { start: "1:48", end: "2:30" },
                    "7th Grade": { start: "11:05", end: "11:44" },
                    "8th Grade": { start: "1:06", end: "1:45" },
                    "Enrichment": { start: null, end: null },
                });
                break;
            case "1/2":
                setSelectedDateTypeObj({
                    description: "1/2",
                    "6th Grade": { start: "10:00", end: "10:35" },
                    "7th Grade": { start: "9:13", end: "9:50" },
                    "8th Grade": { start: "8:30", end: "9:05" },
                    "Enrichment": { start: null, end: null },
                });
                break;
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:flex-row sm:gap-6 sm:py-4">
            {["Normal", "1 Hour", "2 Hour", "1/2"].map((dateType) => {
                const isSelected = selectedDateTypeObj.description === dateType;

                return (
                    <RippleButton
                        key={dateType}
                        onClick={() => getDayTypeObj(dateType)}
                        variant={isSelected ? "outline" : "default"}
                        size="default"
                        className={`
                            font-semibold rounded text-center text-white transition-colors duration-200
                            ${isSelected
                                ? "bg-black text-white"
                                : "bg-baseOrange hover:bg-darkOrange text-white"}
                        `}
                        rippleClassName="bg-white/50"
                    >
                        {dateType} Day
                    </RippleButton>
                );
            })}
        </div>
    );
};

export default DateTypeController;
