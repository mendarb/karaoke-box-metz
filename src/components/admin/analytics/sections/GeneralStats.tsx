import { PeriodSelection } from "../AnalyticsContent";

interface GeneralStatsProps {
  period: PeriodSelection;
}

export const GeneralStats = ({ period }: GeneralStatsProps) => {
  return (
    <div>
      <p>General Stats for period: {period.type}</p>
    </div>
  );
};
