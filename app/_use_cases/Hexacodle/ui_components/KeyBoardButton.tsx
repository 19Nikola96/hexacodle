import { cn } from "@/app/_cross_project/utils";
import { useState } from "react";

type KeyBoardButtonProps = {
  value: string;
  updateGuess: (value: string) => void;
};

const KeyBoardButton = ({ value, updateGuess }: KeyBoardButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      onClick={() => {
        updateGuess(value);
        setIsClicked(true);
        setTimeout(() => {
          setIsClicked(false);
        }, 200);
      }}
      type="button"
      className={cn(
        "bg-white neomorphism-sm flex items-center justify-center text-2xl w-10 h-10 rounded-full cursor-pointer",
        "transition-all dark:bg-transparent dark:text-white",
        isClicked ? "clicked-button-animation" : "",
      )}
    >
      {value}
    </button>
  );
};

export default KeyBoardButton;
