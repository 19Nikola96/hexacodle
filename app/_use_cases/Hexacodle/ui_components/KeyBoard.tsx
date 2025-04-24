import { cn } from "@/app/_cross_project/utils";
import {
  DIGIT_LIST,
  LETTER_LIST,
} from "@/app/_use_cases/Hexacodle/domain/constants";
import KeyBoardButton from "@/app/_use_cases/Hexacodle/ui_components/KeyBoardButton";
import { FaArrowRight } from "react-icons/fa6";

type KeyBoardProps = {
  updateGuess: (value: string) => void;
  validateGuess: () => void;
  isValidateButtonEnable: boolean;
};

const KeyBoard = ({
  updateGuess,
  validateGuess,
  isValidateButtonEnable,
}: KeyBoardProps) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center my-4">
      <div className="flex gap-4">
        {LETTER_LIST.map((letter) => (
          <KeyBoardButton
            key={letter}
            value={letter}
            updateGuess={updateGuess}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {DIGIT_LIST.filter((_, index) => index < 6).map((digit) => (
            <KeyBoardButton
              key={digit}
              value={digit}
              updateGuess={updateGuess}
            />
          ))}
        </div>
        <div className="flex gap-4">
          {DIGIT_LIST.filter((_, index) => index >= 6).map((digit) => (
            <KeyBoardButton
              key={digit}
              value={digit}
              updateGuess={updateGuess}
            />
          ))}
          <button
            type="button"
            disabled={!isValidateButtonEnable}
            onClick={validateGuess}
            className={cn(
              "bg-white neomorphism-sm flex items-center justify-center text-2xl w-24 h-10 rounded-full leading-0 cursor-pointer",
              "transition-all dark:bg-transparent dark:text-white",
              !isValidateButtonEnable ? "opacity-50" : "pop-up-animation",
            )}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyBoard;
