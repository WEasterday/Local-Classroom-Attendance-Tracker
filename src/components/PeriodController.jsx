import { RippleButton } from "../components/ripple-button";
import { calendarDateToObject } from "../utils/dateUtils";

const PeriodController = ({ selectedPeriod, setSelectedPeriod, selectedDate, selectedDay, selectedDateTypeObj }) => {
    let jsDate;
    try {
        const { year, month, day } = calendarDateToObject(selectedDate);
        jsDate = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    } catch {
        jsDate = new Date();
    }
    const isWednesday = jsDate.getDay() === 3;

    const effectivePeriods = [

        ...(Array.isArray(selectedDay)
            ? selectedDay.filter(p =>
                isWednesday
                    ? p.period !== "Enrichment"
                    : p.period !== "Compass"   
              )
            : []),
            
        ...(isWednesday && !selectedDay.some(p => p.period === "Compass")
            ? [{ period: "Compass" }]
            : [])
    ];
    
    return (
        <div className="flex flex-wrap justify-center items-center gap-3 h-auto sm:h-12">
            {effectivePeriods
                .filter(classPeriod => selectedDateTypeObj[classPeriod.period]?.start)
                .sort((item1, item2) => {
                    const [h1, m1] = selectedDateTypeObj[item1.period].start.split(":").map(Number);
                    const [h2, m2] = selectedDateTypeObj[item2.period].start.split(":").map(Number);

                    const normalizeHour = h => (h < 4 ? h + 12 : h); // treat early hours as PM
                    return (normalizeHour(h1) * 60 + m1) - (normalizeHour(h2) * 60 + m2); //subtracts minutes, eg. negative means item1 is first
                })
                .map((classPeriod) => {
                    const isSelected = selectedPeriod === classPeriod.period;

                    return (
                        <RippleButton
                            key={classPeriod.period}
                            onClick={() => setSelectedPeriod(classPeriod.period)}
                            variant={isSelected ? "outline" : "default"}
                            size="sm"
                            className={`
                                w-24 text-center text-white transition-colors duration-200
                                ${isSelected 
                                    ? "bg-black font-semibold" 
                                    : "bg-baseOrange hover:bg-darkOrange"
                                }
                            `}
                            rippleClassName={"bg-white/50"}
                        >
                            {classPeriod.period}
                        </RippleButton>
                    );
                })
            }
      </div>
    );
};

export default PeriodController;
