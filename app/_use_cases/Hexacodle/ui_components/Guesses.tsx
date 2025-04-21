import { useEffect, useRef } from "react";
import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";
import { transformGuessIntoHexaString } from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";
import ClosenessIcon from "@/app/_use_cases/Hexacodle/ui_components/ClosenessIcon";

type GuessesProps = { guessedHexColors: Guess[] };

const Guesses = ({ guessedHexColors }: GuessesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight + 100;
      }
    }, 100);
  }, [guessedHexColors]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 overflow-auto p-2 scroll-smooth"
    >
      {guessedHexColors.map((guess: Guess, index) => {
        const guessHexaColor = transformGuessIntoHexaString(guess);

        return (
          <div
            key={index}
            className="flex gap-1 items-center justify-center p-1 relative"
          >
            <div
              className="guess-background absolute left-0 h-full w-full -z-1 rounded-md neomorphism-sm"
              style={{ backgroundColor: guessHexaColor }}
            ></div>
            {Object.values(guess).map(({ value, closeness }, index) => {
              return (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="w-12 h-14 flex flex-col items-center justify-around transition-all bg-white flip-tile rounded-sm"
                >
                  <span>{value}</span>
                  <ClosenessIcon
                    closeness={closeness}
                    delay={`${index * 75}ms`}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Guesses;
