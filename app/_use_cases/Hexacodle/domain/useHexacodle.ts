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
import { useEffect, useState, useMemo, useCallback } from "react";

type UseHexacodleParams = { isUnlimited: boolean | undefined };

export const useHexacodle = ({ isUnlimited }: UseHexacodleParams) => {
  const [selectedTile, setSelectedTile] = useState<string>("1");
  const [guessedHexColors, setGuessedHexColors] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess>(
    CURRENT_GUESS_DEFAULT_VALUE,
  );
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const { isOpen, openModal, modalRef } = useModal({
    blockOutsideClosing: false,
  });

  useEffect(() => {
    if (isUnlimited) {
      const saved = getLatestActiveUnlimitedGame();
      if (saved && saved?.guessedHexColors.length !== 0) {
        setGuessedHexColors(saved.guessedHexColors);
        setCurrentGuess(saved.currentGuess);
        setSelectedTile(saved.selectedTile);
      }
    } else {
      const saved = getTodayDailyGame();
      if (saved && saved?.guessedHexColors.length !== 0) {
        setGuessedHexColors(saved.guessedHexColors || []);
        setCurrentGuess(saved.currentGuess || CURRENT_GUESS_DEFAULT_VALUE);
        setSelectedTile(saved.selectedTile || "1");
      }
    }
  }, [isUnlimited]);

  const [unlimitedTarget, setUnlimitedTarget] = useState<string | null>(null);

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
  }, [isUnlimited, resetTrigger]);

  const targetHexColor = useMemo(() => {
    if (isUnlimited) return unlimitedTarget || "#000000";
    return generateHexColorWithSeed(computeTodayDateIntoSeed());
  }, [isUnlimited, unlimitedTarget]);

  const targetHexColorMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    targetHexColor.split("").forEach((char, i) => {
      if (i > 0) map[i] = char;
    });
    return map;
  }, [targetHexColor]);

  const lastGuess = guessedHexColors[guessedHexColors.length - 1];
  const lastGuessedHexColor = useMemo(
    () => (lastGuess ? transformGuessIntoHexaString(lastGuess) : undefined),
    [lastGuess],
  );

  const updateGuess = useCallback(
    (value: string) => {
      setCurrentGuess((prev) => ({
        ...prev,
        [selectedTile]: {
          value,
          closeness: prev[Number(selectedTile)].closeness,
        },
      }));

      setSelectedTile((prev) => {
        let nextTile = String(Number(prev) + 1);
        while (
          nextTile <= "6" &&
          (currentGuess[Number(nextTile)]?.value ===
            targetHexColorMap[Number(nextTile)] ||
            currentGuess[Number(nextTile)]?.closeness === 0)
        ) {
          nextTile = String(Number(nextTile) + 1);
        }
        return nextTile > "6" ? "1" : nextTile;
      });
    },
    [selectedTile, currentGuess, targetHexColorMap],
  );

  const validateGuess = useCallback(() => {
    if (
      lastGuessedHexColor === targetHexColor ||
      guessedHexColors.length === 5
    ) {
      openModal();
      return;
    }

    const withCloseness = Object.keys(currentGuess).reduce((acc, key) => {
      const index = Number(key);
      return {
        ...acc,
        [index]: {
          ...currentGuess[index],
          closeness: computeGuessCloseness(
            currentGuess[index].value,
            targetHexColorMap[index],
          ),
        },
      };
    }, {});

    setGuessedHexColors((prev) => [...prev, withCloseness]);

    setCurrentGuess((prev) => {
      const valid = Object.keys(prev).reduce((acc, key) => {
        const i = Number(key);
        if (targetHexColorMap[i] === prev[i].value) {
          acc[i] = { ...prev[i] };
        }
        return acc;
      }, {} as Guess);
      return { ...CURRENT_GUESS_DEFAULT_VALUE, ...valid };
    });

    for (let i = 1; i <= 6; i++) {
      if (currentGuess[i]?.value !== targetHexColorMap[i]) {
        setSelectedTile(String(i));
        return;
      }
    }
    setSelectedTile("1");
  }, [
    guessedHexColors,
    lastGuessedHexColor,
    openModal,
    targetHexColor,
    targetHexColorMap,
    currentGuess,
  ]);

  useEffect(() => {
    const game: StoredGameState = {
      guessedHexColors,
      currentGuess,
      selectedTile,
      status: HexacodleGameStatus.ACTIVE,
      timestamp: Date.now(),
      dateKey: getTodayDateKey(),
    };

    if (isUnlimited) {
      const archived = loadUnlimitedGameList().filter(
        (g) => g.status === HexacodleGameStatus.ARCHIVED,
      );
      saveUnlimitedGameList([...archived, game]);
    } else {
      const previous = loadDailyGameList().filter(
        (g) =>
          g.dateKey !== game.dateKey ||
          g.status === HexacodleGameStatus.ARCHIVED,
      );
      saveDailyGameList([...previous, game]);
    }
  }, [guessedHexColors, currentGuess, selectedTile, isUnlimited]);

  useEffect(() => {
    if (
      lastGuessedHexColor === targetHexColor ||
      guessedHexColors.length === 5
    ) {
      setTimeout(() => {
        openModal();
      }, 600);
    }
  }, [guessedHexColors, lastGuessedHexColor, openModal, targetHexColor]);

  const isValidateButtonEnable = useMemo(
    () =>
      Object.values(currentGuess).filter((guess) => guess.value !== "")
        .length === 6,
    [currentGuess],
  );

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
          prev === "1" ? "1" : String(Number(prev) - 1),
        );
      } else if (event.key === "Enter" && isValidateButtonEnable) {
        validateGuess();
      } else if (event.key === "ArrowLeft") {
        setSelectedTile((prev) =>
          prev === "1" ? "6" : String(Number(prev) - 1),
        );
      } else if (event.key === "ArrowRight") {
        setSelectedTile((prev) =>
          prev === "6" ? "1" : String(Number(prev) + 1),
        );
      }
    },
    [selectedTile, updateGuess, validateGuess, isValidateButtonEnable],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const resetHexacodle = () => {
    if (isUnlimited) {
      const current: StoredGameState = {
        guessedHexColors,
        currentGuess,
        selectedTile,
        status: HexacodleGameStatus.ARCHIVED,
        timestamp: Date.now(),
      };
      archiveCurrentUnlimitedGame(current);
      setResetTrigger((prev) => prev + 1);
      setSelectedTile("1");
      setGuessedHexColors([]);
      setCurrentGuess(CURRENT_GUESS_DEFAULT_VALUE);
      localStorage.removeItem(UNLIMITED_TARGET_KEY);
    }
  };

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
