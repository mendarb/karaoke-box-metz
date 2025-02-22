import { DateRange } from "react-day-picker";

export type PeriodSelection = {
  type: "today" | "yesterday" | "7d" | "30d" | "90d" | "1y" | "custom";
  dateRange?: DateRange;
};