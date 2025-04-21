import { computeTodayDateIntoSeed } from "@/app/_cross_project/dateUtils";
import { generateHexColorWithSeed } from "@/app/_cross_project/generateHexColorWithSeed";
import {
  CURRENT_GUESS_DEFAULT_VALUE,
  Guess,
} from "@/app/_use_cases/Hexacodle/domain/constants";
import {
  computeGuessCloseness,
  transformGuessIntoHexaString,
} from "@/app/_use_cases/Hexacodle/domain/transformGuessIntoHexaString";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";

import { useEffect, useState, useMemo, useCallback } from "react";

type UseHexacodleReturn = {
  targetHexColor: string;
  lastGuessedHexColor: string | undefined;
  guessedHexColors: Guess[];
  currentGuess: Guess;
  selectedTile: string;
  isOpen: boolean;
  modalRef: React.RefObject<HTMLDivElement>;
  isValidateButtonEnable: boolean;
  setSelectedTile: (key: string) => void;
  updateGuess: (value: string) => void;
  validateGuess: () => void;
};

export const useHexacodle = (): UseHexacodleReturn => {
  const [selectedTile, setSelectedTile] = useState<string>("1");
  const [guessedHexColors, setGuessedHexColors] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess>(
    CURRENT_GUESS_DEFAULT_VALUE,
  );
  const { isOpen, openModal, modalRef } = useModal();

  const lastGuess = guessedHexColors[guessedHexColors.length - 1];
  const lastGuessedHexColor = useMemo(
    () => (lastGuess ? transformGuessIntoHexaString(lastGuess) : undefined),
    [lastGuess],
  );
  const targetHexColor = useMemo(
    () => generateHexColorWithSeed(computeTodayDateIntoSeed()),
    [],
  );

  const targetHexColorMap = useMemo(() => {
    const map: { [key: number]: string } = {};

    targetHexColor.split("").forEach((char, index) => {
      if (index > 0) {
        map[index] = char;
      }
    });
    return map;
  }, [targetHexColor]);

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
          currentGuess[Number(nextTile)]?.value ===
            targetHexColorMap[Number(nextTile)]
        ) {
          nextTile = String(Number(nextTile) + 1);
        }
        return nextTile > "6" ? "1" : nextTile;
      });
    },
    [selectedTile, currentGuess, targetHexColorMap],
  );

  const validateGuess = useCallback(() => {
    const currentGuessWithCloseness = Object.keys(currentGuess).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: {
            ...currentGuess[Number(key)],
            closeness: computeGuessCloseness(
              currentGuess[Number(key)].value,
              targetHexColorMap[Number(key)],
            ),
          },
        };
      },
      {},
    );
    setGuessedHexColors((prev) => [...prev, currentGuessWithCloseness]);
    setCurrentGuess((prev) => {
      const validGuesses = Object.values(prev).reduce(
        (acc, { value }, index) => {
          if (targetHexColorMap[index + 1] === value) {
            return {
              ...acc,
              [index + 1]: { value, closeness: prev[index + 1].closeness },
            };
          }
          return acc;
        },
        {},
      );

      return { ...CURRENT_GUESS_DEFAULT_VALUE, ...validGuesses };
    });
    setSelectedTile(() => {
      for (let i = 1; i <= 6; i++) {
        if (currentGuess[i]?.value !== targetHexColorMap[i]) {
          return String(i);
        }
      }
      return "1";
    });
  }, [currentGuess, targetHexColorMap]);

  useEffect(() => {
    if (
      lastGuessedHexColor === targetHexColor ||
      Object.keys(guessedHexColors).length === 5
    ) {
      setTimeout(() => {
        openModal();
      }, 300);
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
      }
    },
    [selectedTile, updateGuess, validateGuess, isValidateButtonEnable],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
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
  };
};
