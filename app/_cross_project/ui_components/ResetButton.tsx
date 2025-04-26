import { cn } from "@/app/_cross_project/utils";
import React, { useState } from "react";
import { GrPowerReset } from "react-icons/gr";

type ResetButtonProps = { resetHexacodle: () => void };

const ResetButton = ({ resetHexacodle }: ResetButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      onClick={() => {
        resetHexacodle();
        setIsClicked(true);
        setTimeout(() => {
          setIsClicked(false);
        }, 200);
      }}
      type="button"
      className={cn(
        "bg-white shadow flex items-center justify-center text-2xl w-10 h-10 rounded-full cursor-pointer absolute -bottom-2 -left-2 z-40",
        isClicked
          ? "clicked-button-animation rotate-360 transition-all"
          : "transition-none",
      )}
    >
      <GrPowerReset />
    </button>
  );
};

export default ResetButton;
