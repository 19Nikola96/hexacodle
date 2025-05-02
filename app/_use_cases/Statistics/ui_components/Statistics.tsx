import React from "react";
import {
  loadDailyGameList,
  loadUnlimitedGameList,
} from "@/app/_cross_project/localStorageUtils";
import StatPanel from "@/app/_use_cases/Statistics/ui_components/StatPanel";
import { calculateAverage } from "@/app/_cross_project/statsUtils";

const Statistics = () => {
  const storedDailyGames = loadDailyGameList();
  const storedUnlimitedGames = loadUnlimitedGameList();

  const dailyGamePlayed = storedDailyGames.filter(
    (game) => game.guessedHexColors.length !== 0,
  );
  const dailyGameWon = dailyGamePlayed.filter((game) => {
    const gameLastGuess = game.guessedHexColors.reverse()[0];
    return Object.values(gameLastGuess).every((game) => game.closeness === 0);
  });
  const dailyGameAverageTry = calculateAverage(
    dailyGamePlayed.map((game) => game.guessedHexColors.length),
  );

  const unlimitedGamePlayed = storedUnlimitedGames.filter(
    (game) => game.guessedHexColors.length !== 0,
  );
  const unlimitedGameWon = unlimitedGamePlayed.filter((game) => {
    const gameLastGuess = game.guessedHexColors.reverse()[0];
    return Object.values(gameLastGuess).every((game) => game.closeness === 0);
  });
  const unlimitedGameAverageTry = calculateAverage(
    unlimitedGamePlayed.map((game) => game.guessedHexColors.length),
  );

  return (
    <div className="fade-in-animation flex flex-col dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatPanel
          title="Daily games"
          gamePlayed={dailyGamePlayed}
          gameWon={dailyGameWon}
          averageTry={dailyGameAverageTry}
        />
        <StatPanel
          title="Unlimited games"
          gamePlayed={unlimitedGamePlayed}
          gameWon={unlimitedGameWon}
          averageTry={unlimitedGameAverageTry}
        />
      </div>
    </div>
  );
};

export default Statistics;
