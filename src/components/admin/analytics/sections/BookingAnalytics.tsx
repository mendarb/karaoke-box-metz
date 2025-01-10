import { Loader2 } from "lucide-react";
import { useBookingAnalytics } from "../hooks/useBookingAnalytics";
import { AnalyticsCharts } from "./analytics-charts/AnalyticsCharts";
import { AnalyticsStats } from "./analytics-stats/AnalyticsStats";

export const BookingAnalytics = () => {
  const { bookings, stepsTracking, isLoading } = useBookingAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsStats bookings={bookings} stepsTracking={stepsTracking} />
      <AnalyticsCharts bookings={bookings} stepsTracking={stepsTracking} />
    </div>
  );
};