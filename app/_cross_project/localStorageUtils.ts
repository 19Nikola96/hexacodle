import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";

export enum HexacodleGameStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export type StoredGameState = {
  guessedHexColors: Guess[];
  currentGuess: Guess;
  selectedTile: string;
  status?: HexacodleGameStatus;
  timestamp: number;
  dateKey?: string;
};

export type StoredGameStateList = StoredGameState[];

export const DAILY_KEY = "hexacodle-daily";
export const UNLIMITED_KEY = "hexacodle-unlimited";
export const UNLIMITED_TARGET_KEY = "hexacodle-unlimited-target";

export const loadUnlimitedGameList = (): StoredGameStateList => {
  const raw = localStorage.getItem(UNLIMITED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredGameStateList;
  } catch {
    return [];
  }
};

export const saveUnlimitedGameList = (games: StoredGameStateList) => {
  localStorage.setItem(UNLIMITED_KEY, JSON.stringify(games));
};

export const getLatestActiveUnlimitedGame = (): StoredGameState | null => {
  const games = loadUnlimitedGameList();
  return (
    games.find((game) => game.status === HexacodleGameStatus.ACTIVE) || null
  );
};

export const archiveCurrentUnlimitedGame = () => {
  const games = loadUnlimitedGameList().map((game) => ({
    ...game,
    status: HexacodleGameStatus.ARCHIVED,
  }));
  saveUnlimitedGameList(games);
};

export const loadDailyGameList = (): StoredGameState[] => {
  try {
    return JSON.parse(localStorage.getItem(DAILY_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveDailyGameList = (games: StoredGameState[]) => {
  localStorage.setItem(DAILY_KEY, JSON.stringify(games));
};

export const getTodayDateKey = (): string =>
  new Date().toISOString().split("T")[0];

export const getTodayDailyGame = (): StoredGameState | null => {
  const games = loadDailyGameList();
  return (
    games.find(
      (g) =>
        g.dateKey === getTodayDateKey() &&
        g.status === HexacodleGameStatus.ACTIVE,
    ) || null
  );
};

export const clearUnlimitedGames = () => {
  localStorage.removeItem(UNLIMITED_KEY);
};
