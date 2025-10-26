import { RippleButton } from "../components/ripple-button";

const RotationController = ({ selectedRotation, setSelectedRotation }) => {
    return (
        <div className="flex items-center justify-center gap-2 sm:flex-row sm:gap-6 sm:py-4">
            {["A", "B"].map((rotation) => {
                const isSelected = selectedRotation === rotation;

                return (
                    <RippleButton
                        key={rotation}
                        onClick={() => setSelectedRotation(rotation)}
                        variant={isSelected ? "outline" : "default"}
                        size="default"
                        className={`
                        font-semibold rounded transition-colors text-center text-white transition-colors duration-200
                        ${isSelected
                            ? "bg-black text-white"
                            : "bg-baseOrange hover:bg-darkOrange text-white"}
                        `}
                        rippleClassName="bg-white/50"
                    >
                        {rotation} Day
                    </RippleButton>
                );
            })}
        </div>
    );
};

export default RotationController;
