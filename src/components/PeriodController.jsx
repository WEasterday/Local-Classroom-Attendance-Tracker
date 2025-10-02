const PeriodController = ({ selectedPeriod, setSelectedPeriod, selectedDay }) => {
  return (
    <div className="flex h-12 justify-around items-center bg-blue-500">
      {selectedDay.map((classPeriod) => {
        const isSelected = selectedPeriod === classPeriod.period;
        return (
          <div
            key={classPeriod.period}
            onClick={() => setSelectedPeriod(classPeriod.period)}
            className={`
              w-24 text-center py-2 rounded cursor-pointer
              transition-colors duration-200
              ${isSelected ? 'bg-yellow-300 text-blue-700 font-semibold' : 'bg-blue-400 text-white hover:bg-blue-600'}
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
