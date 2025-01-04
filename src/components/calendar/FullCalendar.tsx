import { Booking } from "@/integrations/supabase/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Euro } from "lucide-react";

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    return status === 'paid' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6 p-6">
      {Object.entries(groupedBookings).map(([date, dayBookings]) => (
        <Card key={date} className="p-4">
          <h3 className="font-semibold mb-4 text-lg border-b pb-2">{date}</h3>
          <div className="space-y-3">
            {dayBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{booking.time_slot}h</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{booking.duration}h</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{booking.user_name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{booking.group_size} pers.</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{booking.price}€</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end space-x-2 md:space-x-0 md:space-y-2">
                  <Badge variant={getStatusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                  <Badge variant={getPaymentStatusVariant(booking.payment_status)}>
                    {booking.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};