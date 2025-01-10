import { Loader2 } from "lucide-react";
import { BookingStepsChart } from "../charts/BookingStepsChart";
import { GroupSizeChart } from "../charts/GroupSizeChart";
import { DurationChart } from "../charts/DurationChart";
import { WeekdayChart } from "../charts/WeekdayChart";
import { useBookingAnalytics } from "../hooks/useBookingAnalytics";
import { 
  calculateGroupSizeData, 
  calculateDurationData, 
  calculateDayData, 
  calculateStepData 
} from "../utils/analyticsCalculations";

export const BookingAnalytics = () => {
  const { bookings, stepsTracking, isLoading } = useBookingAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const groupSizeChartData = calculateGroupSizeData(bookings || []);
  const durationChartData = calculateDurationData(bookings || []);
  const dayChartData = calculateDayData(bookings || []);
  const stepChartData = calculateStepData(stepsTracking || []);

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