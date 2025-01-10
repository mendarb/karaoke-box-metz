import { Loader2 } from "lucide-react";
import { PeriodSelection } from "../types/analytics";
import { MetricCard } from "./general-stats/MetricCard";
import { useAnalyticsData } from "./general-stats/useAnalyticsData";
import { getMetricsConfig } from "./general-stats/getMetricsConfig";

interface GeneralStatsProps {
  period: PeriodSelection;
}

export const GeneralStats = ({ period }: GeneralStatsProps) => {
  const { data: stats, isLoading } = useAnalyticsData(period);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const metrics = getMetricsConfig(stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};