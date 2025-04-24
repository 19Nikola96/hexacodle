import { cn } from "@/app/_cross_project/utils";
import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";

type CurrentGuessProps = {
  currentGuess: Guess;
  selectedTile: string;
  setSelectedTile: (key: string) => void;
};

const CurrentGuess = ({
  currentGuess,
  selectedTile,
  setSelectedTile,
}: CurrentGuessProps) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <span className="dark:text-white">#</span>
      {Object.keys(currentGuess).map((key) => {
        return (
          <div
            key={key}
            onClick={() => setSelectedTile(key)}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-sm neomorphism-sm border-slate-500 border-1 bg-white cursor-pointer",
              "transition-all dark:bg-transparent dark:text-white",
              selectedTile === key ? "selected-tile-animation" : "",
            )}
          >
            {currentGuess[Number(key)].value}
          </div>
        );
      })}
    </div>
  );
};

export default CurrentGuess;
