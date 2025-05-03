import { useEffect, useState, useMemo, useCallback } from "react";
import { computeTodayDateIntoSeed } from "@/app/_cross_project/dateUtils";
import { generateHexColorWithSeed } from "@/app/_cross_project/generateHexColorWithSeed";
import {
  archiveCurrentUnlimitedGame,
  getLatestActiveUnlimitedGame,
  getTodayDailyGame,
  getTodayDateKey,
  HexacodleGameStatus,
  loadDailyGameList,
  loadUnlimitedGameList,
  saveDailyGameList,
  saveUnlimitedGameList,
  StoredGameState,
  UNLIMITED_TARGET_KEY,
} from "@/app/_cross_project/localStorageUtils";
import {
  CURRENT_GUESS_DEFAULT_VALUE,
  Guess,
} from "@/app/_use_cases/Hexacodle/domain/constants";
import {
  transformGuessIntoHexaString,
  computeGuessCloseness,
} from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";

type UseHexacodleParams = { isUnlimited: boolean | undefined };
const DEFAULT_TILE = "1";
const MAX_TILE = 6;

export const useHexacodle = ({ isUnlimited }: UseHexacodleParams) => {
  // ===== State =====
  const [selectedTile, setSelectedTile] = useState<string>(DEFAULT_TILE);
  const [guessedHexColors, setGuessedHexColors] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess>(
    CURRENT_GUESS_DEFAULT_VALUE,
  );
  const [unlimitedResetCount, setUnlimitedResetCount] = useState<number>(0);
  const [unlimitedTarget, setUnlimitedTarget] = useState<string | null>(null);

  const { isOpen, openModal, modalRef } = useModal({
    blockOutsideClosing: false,
  });

  // ===== Game Load =====
  useEffect(() => {
    const saved = isUnlimited
      ? getLatestActiveUnlimitedGame()
      : getTodayDailyGame();
    if (saved && saved.guessedHexColors.length !== 0) {
      setGuessedHexColors(saved.guessedHexColors);
      setCurrentGuess(saved.currentGuess || CURRENT_GUESS_DEFAULT_VALUE);
      setSelectedTile(saved.selectedTile || DEFAULT_TILE);
    }
  }, [isUnlimited]);

  // ===== Target Color (Unlimited Mode) =====
  useEffect(() => {
    if (isUnlimited) {
      const stored = localStorage.getItem(UNLIMITED_TARGET_KEY);
      if (stored) {
        setUnlimitedTarget(stored);
      } else {
        const generated = generateHexColorWithSeed(Math.random());
        localStorage.setItem(UNLIMITED_TARGET_KEY, generated);
        setUnlimitedTarget(generated);
      }
    }
  }, [isUnlimited, unlimitedResetCount]);

  // ===== Derived State =====
  const targetHexColor = useMemo(() => {
    return isUnlimited
      ? unlimitedTarget || "#000000"
      : generateHexColorWithSeed(computeTodayDateIntoSeed());
  }, [isUnlimited, unlimitedTarget]);

  const targetHexColorMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    targetHexColor.split("").forEach((char, i) => {
      if (i > 0) map[i] = char;
    });
    return map;
  }, [targetHexColor]);

  const lastGuess = guessedHexColors[guessedHexColors.length - 1];
  const lastGuessedHexColor = useMemo(() => {
    return lastGuess ? transformGuessIntoHexaString(lastGuess) : undefined;
  }, [lastGuess]);

  const isValidateButtonEnable = useMemo(() => {
    return (
      Object.values(currentGuess).filter((guess) => guess.value !== "")
        .length === 6
    );
  }, [currentGuess]);

  // ===== Helpers =====
  const computeNextTile = useCallback(
    (from: string) => {
      let next = String(Number(from) + 1);
      while (
        Number(next) <= MAX_TILE &&
        (currentGuess[Number(next)]?.value ===
          targetHexColorMap[Number(next)] ||
          currentGuess[Number(next)]?.closeness === 0)
      ) {
        next = String(Number(next) + 1);
      }
      return Number(next) > MAX_TILE ? DEFAULT_TILE : next;
    },
    [currentGuess, targetHexColorMap],
  );

  const createStoredGameState = useCallback(
    (): StoredGameState => ({
      guessedHexColors,
      currentGuess,
      selectedTile,
      status: HexacodleGameStatus.ACTIVE,
      timestamp: Date.now(),
      dateKey: getTodayDateKey(),
    }),
    [currentGuess, guessedHexColors, selectedTile],
  );

  // ===== Game Logic =====
  const updateGuess = useCallback(
    (value: string) => {
      setCurrentGuess((prev) => ({
        ...prev,
        [selectedTile]: {
          value,
          closeness: prev[Number(selectedTile)].closeness,
        },
      }));
      setSelectedTile(computeNextTile(selectedTile));
    },
    [selectedTile, computeNextTile],
  );

  const validateGuess = useCallback(() => {
    if (
      lastGuessedHexColor === targetHexColor ||
      guessedHexColors.length === 5
    ) {
      openModal();
      return;
    }

    const withCloseness: Guess = Object.keys(currentGuess).reduce(
      (acc, key) => {
        const index = Number(key);
        acc[index] = {
          ...currentGuess[index],
          closeness: computeGuessCloseness(
            currentGuess[index].value,
            targetHexColorMap[index],
          ),
        };
        return acc;
      },
      {} as Guess,
    );

    setGuessedHexColors((prev) => [...prev, withCloseness]);

    setCurrentGuess(() => {
      const valid = Object.keys(withCloseness).reduce((acc, key) => {
        const i = Number(key);
        if (targetHexColorMap[i] === withCloseness[i].value) {
          acc[i] = { ...withCloseness[i] };
        }
        return acc;
      }, {} as Guess);
      return { ...CURRENT_GUESS_DEFAULT_VALUE, ...valid };
    });

    for (let i = 1; i <= MAX_TILE; i++) {
      if (currentGuess[i]?.value !== targetHexColorMap[i]) {
        setSelectedTile(String(i));
        return;
      }
    }
    setSelectedTile(DEFAULT_TILE);
  }, [
    guessedHexColors,
    lastGuessedHexColor,
    targetHexColor,
    currentGuess,
    targetHexColorMap,
    openModal,
  ]);

  const resetHexacodle = () => {
    if (isUnlimited) {
      archiveCurrentUnlimitedGame();
      localStorage.removeItem(UNLIMITED_TARGET_KEY);
      setUnlimitedResetCount((prev) => prev + 1);
      setSelectedTile(DEFAULT_TILE);
      setGuessedHexColors([]);
      setCurrentGuess(CURRENT_GUESS_DEFAULT_VALUE);
    }
  };

  // ===== Persistence =====
  useEffect(() => {
    const game = createStoredGameState();
    if (isUnlimited) {
      const archived = loadUnlimitedGameList().filter(
        (g) => g.status === HexacodleGameStatus.ARCHIVED,
      );
      if (game.guessedHexColors.length !== 0) {
        saveUnlimitedGameList([...archived, game]);
      }
    } else {
      const previous = loadDailyGameList().filter(
        (g) =>
          g.dateKey !== game.dateKey ||
          g.status === HexacodleGameStatus.ARCHIVED,
      );
      saveDailyGameList([...previous, game]);
    }
  }, [
    guessedHexColors,
    currentGuess,
    selectedTile,
    isUnlimited,
    createStoredGameState,
  ]);

  // ===== Endgame Modal Auto-trigger =====
  useEffect(() => {
    if (
      lastGuessedHexColor === targetHexColor ||
      guessedHexColors.length === 5
    ) {
      setTimeout(openModal, 600);
    }
  }, [guessedHexColors, lastGuessedHexColor, targetHexColor, openModal]);

  // ===== Keyboard Navigation =====
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (/^[0-9a-fA-F]$/.test(event.key)) {
        updateGuess(event.key.toUpperCase());
      } else if (event.key === "Backspace") {
        setCurrentGuess((prev) => ({
          ...prev,
          [selectedTile]: {
            value: "",
            closeness: prev[Number(selectedTile)].closeness,
          },
        }));
        setSelectedTile((prev) =>
          prev === DEFAULT_TILE ? DEFAULT_TILE : String(Number(prev) - 1),
        );
      } else if (event.key === "Enter" && isValidateButtonEnable) {
        validateGuess();
      } else if (event.key === "ArrowLeft") {
        setSelectedTile((prev) =>
          prev === DEFAULT_TILE ? String(MAX_TILE) : String(Number(prev) - 1),
        );
      } else if (event.key === "ArrowRight") {
        setSelectedTile((prev) =>
          prev === String(MAX_TILE) ? DEFAULT_TILE : String(Number(prev) + 1),
        );
      }
    },
    [selectedTile, updateGuess, isValidateButtonEnable, validateGuess],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return {
    targetHexColor,
    lastGuessedHexColor,
    guessedHexColors,
    currentGuess,
    selectedTile,
    isOpen,
    modalRef,
    isValidateButtonEnable,
    setSelectedTile,
    updateGuess,
    validateGuess,
    resetHexacodle,
  };
};
