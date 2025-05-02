export const calculateWinPercentage = (won: number, played: number) => {
  const winPercentage = played === 0 ? 0 : (won / played) * 100;
  return Number.isInteger(Number(winPercentage))
    ? winPercentage
    : winPercentage.toFixed(2);
};

export const calculateAverage = (arr: number[]) => {
  if (arr.length === 0) return "0";

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const average = sum / arr.length;

  return Number.isInteger(average) ? String(average) : average.toFixed(2);
};
