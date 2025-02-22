import { PeriodSelection } from "../../../types/analytics";
import { format, subDays, startOfYear, startOfDay, endOfDay } from "date-fns";

export const getDateRange = (period: PeriodSelection) => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  switch (period.type) {
    case "today":
      return {
        startDate: format(startOfDay(now), 'yyyy-MM-dd'),
        endDate: format(endOfDay(now), 'yyyy-MM-dd')
      };
    case "yesterday":
      return {
        startDate: format(startOfDay(subDays(now, 1)), 'yyyy-MM-dd'),
        endDate: format(endOfDay(subDays(now, 1)), 'yyyy-MM-dd')
      };
    case "7d":
      return {
        startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
        endDate: today
      };
    case "30d":
      return {
        startDate: format(subDays(now, 30), 'yyyy-MM-dd'),
        endDate: today
      };
    case "90d":
      return {
        startDate: format(subDays(now, 90), 'yyyy-MM-dd'),
        endDate: today
      };
    case "1y":
      return {
        startDate: format(startOfYear(now), 'yyyy-MM-dd'),
        endDate: today
      };
    case "custom":
      if (period.dateRange?.from && period.dateRange?.to) {
        return {
          startDate: format(period.dateRange.from, 'yyyy-MM-dd'),
          endDate: format(period.dateRange.to, 'yyyy-MM-dd')
        };
      }
      return {
        startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
        endDate: today
      };
    default:
      return {
        startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
        endDate: today
      };
  }
};