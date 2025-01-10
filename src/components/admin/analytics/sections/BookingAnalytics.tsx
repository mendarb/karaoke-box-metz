import { Loader2 } from "lucide-react";
import { useBookingAnalytics } from "../hooks/useBookingAnalytics";
import { AnalyticsCharts } from "./analytics-charts/AnalyticsCharts";
import { AnalyticsStats } from "./analytics-stats/AnalyticsStats";
import { PeriodSelection } from "../AnalyticsContent";

interface BookingAnalyticsProps {
  period: PeriodSelection;
}

export const BookingAnalytics = ({ period }: BookingAnalyticsProps) => {
  const { bookings, previousBookings, events, previousEvents, isLoading } = useBookingAnalytics(period);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsStats 
        bookings={bookings} 
        previousBookings={previousBookings}
        events={events}
        previousEvents={previousEvents}
        period={period}
      />
      <AnalyticsCharts 
        bookings={bookings} 
        events={events}
      />
    </div>
  );
};