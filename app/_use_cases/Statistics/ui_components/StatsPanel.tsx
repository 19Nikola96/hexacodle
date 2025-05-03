import {
  clearUnlimitedGames,
  StoredGameState,
} from "@/app/_cross_project/localStorageUtils";
import { calculateWinPercentage } from "@/app/_cross_project/statsUtils";
import React from "react";

type StatPanelProps = {
  title: string;
  gamePlayed: StoredGameState[];
  gameWon: StoredGameState[];
  averageTry: string;
};

const StatsPanel = ({
  title,
  gamePlayed,
  gameWon,
  averageTry,
}: StatPanelProps) => {
  return (
    <div className="neomorphism py-3 px-5 rounded-lg bg-white dark:bg-transparent">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex justify-between mb-2">
        <span>Games played:</span>
        <span>{gamePlayed.length}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Games won:</span>
        <span>{gameWon.length}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Win percentage:</span>
        <span>
          {calculateWinPercentage(gameWon.length, gamePlayed.length)} %
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Average try:</span>
        <span>{averageTry}</span>
      </div>
      {title === "Caca" && (
        <div
          className="flex justify-end underline opacity-50 cursor-pointer"
          onClick={clearUnlimitedGames}
        >
          Reset
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
