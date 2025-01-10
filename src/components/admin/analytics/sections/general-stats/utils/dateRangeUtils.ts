import { format, subDays } from "date-fns";
import { PeriodSelection } from "../../../types/analytics";

export const getDateRange = (period: PeriodSelection) => {
  const now = new Date();
  switch (period.type) {
    case "24h":
      return {
        startDate: format(subDays(now, 1), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd')
      };
    case "7d":
      return {
        startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd')
      };
    case "30d":
      return {
        startDate: format(subDays(now, 30), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd')
      };
    case "90d":
      return {
        startDate: format(subDays(now, 90), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd')
      };
    case "custom":
      if (period.dateRange?.from && period.dateRange?.to) {
        return {
          startDate: format(period.dateRange.from, 'yyyy-MM-dd'),
          endDate: format(period.dateRange.to, 'yyyy-MM-dd')
        };
      }
    default:
      return {
        startDate: format(subDays(now, 30), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd')
      };
  }
};