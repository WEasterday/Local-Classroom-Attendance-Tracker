import { RippleButton } from "../components/ripple-button";

const PeriodController = ({ selectedPeriod, setSelectedPeriod, selectedDay }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 h-auto sm:h-12">
      {selectedDay.map((classPeriod) => {
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
            Period {classPeriod.period}
          </RippleButton>
        );
      })}
    </div>
  );
};

export default PeriodController;
