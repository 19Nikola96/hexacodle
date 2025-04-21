import { Guess } from "@/app/_use_cases/Hexacodle/domain/constants";

export const transformGuessIntoHexaString = (guess: Guess) => {
  return `#${Object.values(guess)
    .map(({ value }) => value)
    .join("")}`;
};

export const computeGuessCloseness = (
  guess: string,
  target: string,
): number => {
  if (guess === target) {
    return 0;
  }

  const guessValue = parseInt(guess, 16);
  const targetValue = parseInt(target, 16);
  const difference = targetValue - guessValue;

  if (difference <= -2) {
    return -2;
  } else if (difference <= -1) {
    return -1;
  }

  if (difference <= 2) {
    return 1;
  } else if (difference > 2) {
    return 2;
  }
  return 0;
};

export const computeGuessClosenessIntoEmoji = (
  guessCloseness: number,
): string => {
  if (guessCloseness === 0) {
    return "✅";
  }

  if (guessCloseness <= -2) {
    return "⏬️";
  } else if (guessCloseness <= -1) {
    return "🔽";
  }

  if (guessCloseness <= 2) {
    return "🔼";
  } else if (guessCloseness > 2) {
    return "⏫️";
  }
  return "✅";
};
