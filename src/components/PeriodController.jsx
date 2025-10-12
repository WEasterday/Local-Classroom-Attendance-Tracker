const PeriodController = ({ selectedPeriod, setSelectedPeriod, selectedDay }) => {
  return (
    <div className="flex h-12 justify-around items-center">
      {selectedDay.map((classPeriod) => {
        const isSelected = selectedPeriod === classPeriod.period;
        return (
          <div
            key={classPeriod.period}
            onClick={() => setSelectedPeriod(classPeriod.period)}
            className={`
              w-24 text-center py-2 rounded cursor-pointer
              transition-colors duration-200 text-white
              ${isSelected ? 'bg-black font-semibold border border-2 border-redAccent' : 'bg-baseOrange hover:bg-darkOrange'}
            `}
          >
            Period {classPeriod.period}
          </div>
        );
      })}
    </div>
  );
};

export default PeriodController;
