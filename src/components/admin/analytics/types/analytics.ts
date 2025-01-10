import { DateRange } from "react-day-picker";

export type PeriodSelection = {
  type: "24h" | "7d" | "30d" | "90d" | "1y" | "custom";
  dateRange?: DateRange;
};