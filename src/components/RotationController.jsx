import { RippleButton } from "../components/ripple-button";

const RotationController = ({ selectedRotation, setSelectedRotation }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-8 sm:flex-row sm:gap-6 sm:py-4">
      {["A", "B"].map((rotation) => {
        const isSelected = selectedRotation === rotation;

        return (
          <RippleButton
            key={rotation}
            onClick={() => setSelectedRotation(rotation)}
            variant={isSelected ? "outline" : "default"}
            size="default"
            className={`
              px-6 py-2 font-semibold rounded transition-colors
              ${isSelected
                ? "bg-sky-700 text-white"
                : "bg-sky-500 hover:bg-sky-600 text-white"}
            `}
            rippleClassName={isSelected ? "bg-sky-300" : "bg-white/50"}
          >
            {rotation} Day
          </RippleButton>
        );
      })}
    </div>
  );
};

export default RotationController;
