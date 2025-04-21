export const DIGIT_LIST = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const LETTER_LIST = ["A", "B", "C", "D", "E", "F"];

export type Guess = {
  [key: number]: {
    value: string;
    closeness: number;
  };
};

export const CURRENT_GUESS_DEFAULT_VALUE: Guess = {
  1: { value: "", closeness: 2 },
  2: { value: "", closeness: 2 },
  3: { value: "", closeness: 2 },
  4: { value: "", closeness: 2 },
  5: { value: "", closeness: 2 },
  6: { value: "", closeness: 2 },
};
