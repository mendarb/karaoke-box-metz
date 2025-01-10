import { PeriodSelection } from "../../AnalyticsContent";

interface AnalyticsStatsProps {
  bookings: any[];
  previousBookings: any[];
  events: any[];
  previousEvents: any[];
  period: PeriodSelection;
}

export const AnalyticsStats = ({ bookings, previousBookings, events, previousEvents, period }: AnalyticsStatsProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Analytics Stats</h2>
      <p>Analytics Stats for period: {period.type}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Current Bookings</h3>
          <p>{bookings.length} bookings</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Previous Bookings</h3>
          <p>{previousBookings.length} bookings</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Current Events</h3>
          <p>{events.length} events</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Previous Events</h3>
          <p>{previousEvents.length} events</p>
        </div>
      </div>
    </div>
  );
};
