import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { GeneralStats } from "./sections/GeneralStats";
import { PeriodSelector } from "./components/PeriodSelector";
import { AnalyticsTabs } from "./components/AnalyticsTabs";
import { PeriodSelection } from "./types/analytics";

export const AnalyticsContent = () => {
  const [period, setPeriod] = useState<PeriodSelection>({ type: "today" });
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handlePeriodChange = (value: string) => {
    if (value === "custom") {
      setPeriod({ type: "custom", dateRange: date });
    } else {
      setPeriod({ type: value as PeriodSelection["type"] });
    }
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setPeriod({ type: "custom", dateRange: newDate });
  };

  return (
    <div className="space-y-6">
      <PeriodSelector
        period={period}
        date={date}
        onPeriodChange={handlePeriodChange}
        onDateChange={handleDateChange}
      />
      <GeneralStats period={period} />
      <AnalyticsTabs period={period} />
    </div>
  );
};