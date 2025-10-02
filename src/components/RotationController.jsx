const RotationController = ({ selectedRotation, setSelectedRotation }) => {
  const baseClass = "px-4 py-2 rounded font-semibold transition-colors";

  return (
    <div className="flex items-center justify-center gap-2 p-8 sm:flex-row sm:gap-6 sm:py-4">
      <button
        className={`${baseClass} ${
          selectedRotation === 'A'
            ? 'bg-sky-700 text-white'
            : 'bg-sky-500 hover:bg-sky-600 text-white' 
        }`}
        onClick={() => setSelectedRotation('A')}
      >
        A Day
      </button>

      <button
        className={`${baseClass} ${
          selectedRotation === 'B'
            ? 'bg-sky-700 text-white'  
            : 'bg-sky-500 hover:bg-sky-600 text-white'
        }`}
        onClick={() => setSelectedRotation('B')}
      >
        B Day
      </button>
    </div>
  );
};

export default RotationController;
