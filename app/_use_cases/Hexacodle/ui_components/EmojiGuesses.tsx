import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";
import { computeGuessClosenessIntoEmoji } from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";
import React from "react";

type EmojiGuessesProps = {
  finalGuesses: Guess[];
};

const EmojiGuesses = ({ finalGuesses }: EmojiGuessesProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span>Congrats !!!</span>
      <div className="flex flex-col items-center gap-0.5 overflow-auto p-2">
        {finalGuesses.map((guess: Guess, index) => {
          return (
            <div
              key={index}
              className="flex gap-0.5 items-center justify-center"
            >
              {Object.values(guess).map(({ closeness }, index) => {
                return (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="flex flex-col items-center justify-around transition-all bg-white rounded-sm text-3xl"
                  >
                    {computeGuessClosenessIntoEmoji(closeness)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmojiGuesses;
