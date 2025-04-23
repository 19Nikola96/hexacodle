"use client";

import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";
import { transformGuessIntoHexaString } from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";

const BASED_GUESS_HEX_COLOR = "#55558B";

type ColoredSquareProps = {
  hexColor?: string | undefined;
  label: string;
  guessedHexColors?: Guess[] | undefined;
};

const ColoredSquare = ({
  hexColor,
  label,
  guessedHexColors,
}: ColoredSquareProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span>{label}</span>
      <div className="w-36 h-36 rounded-lg neomorphism border-4 border-white relative overflow-hidden">
        <div
          className="translate-in-animation w-full h-full"
          id={`colored-square-${new Date().toISOString()}`}
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
