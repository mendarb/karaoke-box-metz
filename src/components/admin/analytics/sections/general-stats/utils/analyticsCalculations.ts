export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export const calculateConversionRate = (completed: number, started: number): number => {
  if (started === 0) return 0;
  return (completed / started) * 100;
};