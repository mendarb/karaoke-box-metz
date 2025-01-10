export const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const calculateConversionRate = (completed: number, started: number) => {
  return started > 0 ? (completed / started) * 100 : 0;
};