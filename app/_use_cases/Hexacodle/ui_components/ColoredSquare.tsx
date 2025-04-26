"use client";

import ResetButton from "@/app/_cross_project/ui_components/ResetButton";
import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";
import { transformGuessIntoHexaString } from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";

const BASED_GUESS_HEX_COLOR = "#55558B00";

type ColoredSquareProps = {
  hexColor?: string | undefined;
  label: string;
  guessedHexColors?: Guess[] | undefined;
  resetHexacodle?: () => void;
};

const ColoredSquare = ({
  hexColor,
  label,
  guessedHexColors,
  resetHexacodle,
}: ColoredSquareProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 fade-in-animation relative"
      style={{ animationDelay: hexColor ? "0ms" : "200ms" }}
    >
      <span className="dark:text-white">{label}</span>
      {hexColor && resetHexacodle && (
        <ResetButton resetHexacodle={resetHexacodle} />
      )}
      <div className="w-38 h-38 rounded-lg neomorphism border-4 border-white relative overflow-hidden transition-all">
        <div
          className="translate-in-animation w-full h-full"
          style={{ backgroundColor: hexColor ?? BASED_GUESS_HEX_COLOR }}
        />
        {guessedHexColors &&
          guessedHexColors?.length > 0 &&
          guessedHexColors.map((guess: Guess, index) => {
            const guessHexaColor = transformGuessIntoHexaString(guess);
            return (
              <div
                key={index}
                className="translate-in-animation w-full h-full absolute top-0"
                style={{ backgroundColor: guessHexaColor }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ColoredSquare;
