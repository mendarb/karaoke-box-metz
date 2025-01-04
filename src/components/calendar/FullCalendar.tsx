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

  return (
    <div className="space-y-6">
      {Object.entries(groupedBookings).map(([date, dayBookings]) => (
        <Card key={date} className="p-4">
          <h3 className="font-semibold mb-4 text-lg border-b pb-2">{date}</h3>
          <div className="space-y-3">
            {dayBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
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

                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant={
                      booking.status === 'confirmed' ? 'success' :
                      booking.status === 'pending' ? 'warning' :
                      'destructive'
                    }
                  >
                    {booking.status}
                  </Badge>
                  <Badge 
                    variant={
                      booking.payment_status === 'paid' ? 'success' :
                      'warning'
                    }
                  >
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