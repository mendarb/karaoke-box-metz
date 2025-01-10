import { BookingStepsChart } from "../../charts/BookingStepsChart";
import { GroupSizeChart } from "../../charts/GroupSizeChart";
import { DurationChart } from "../../charts/DurationChart";
import { WeekdayChart } from "../../charts/WeekdayChart";
import { 
  calculateGroupSizeData, 
  calculateDurationData, 
  calculateDayData, 
  calculateStepData 
} from "../../utils/analyticsCalculations";

interface AnalyticsChartsProps {
  bookings: any[];
  stepsTracking: any[];
}

export const AnalyticsCharts = ({ bookings, stepsTracking }: AnalyticsChartsProps) => {
  const groupSizeChartData = calculateGroupSizeData(bookings);
  const durationChartData = calculateDurationData(bookings);
  const dayChartData = calculateDayData(bookings);
  const stepChartData = calculateStepData(stepsTracking);

  return (
    <div className="space-y-6">
      <BookingStepsChart data={stepChartData} />
      <div className="grid gap-4 md:grid-cols-2">
        <GroupSizeChart data={groupSizeChartData} />
        <DurationChart data={durationChartData} />
      </div>
      <WeekdayChart data={dayChartData} />
    </div>
  );
};