import { Loader2 } from "lucide-react";
import { BookingCard } from "./history/BookingCard";
import { useBookingHistory } from "./history/useBookingHistory";

export const BookingHistory = () => {
  const { data: bookings, isLoading } = useBookingHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        Vous n'avez pas encore de réservations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes réservations</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};