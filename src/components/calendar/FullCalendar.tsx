import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FullCalendarProps {
  bookings: Booking[];
  isLoading: boolean;
}

export const FullCalendar = ({ bookings, isLoading }: FullCalendarProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = format(new Date(booking.date), 'dd MMMM yyyy', { locale: fr });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedBookings).map(([date, dayBookings]) => (
        <Card key={date} className="p-4">
          <h3 className="font-semibold mb-4">{date}</h3>
          <div className="space-y-2">
            {dayBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{booking.time_slot}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.user_name} - {booking.group_size} personnes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{booking.duration}h</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};