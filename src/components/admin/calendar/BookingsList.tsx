import { Booking } from "@/hooks/useBookings";
import { BookingsListHeader } from "./list/BookingsListHeader";
import { BookingListItem } from "./list/BookingListItem";

interface BookingsListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  selectedDate?: Date;
}

export const BookingsList = ({ 
  bookings, 
  onViewDetails,
  selectedDate
}: BookingsListProps) => {
  return (
    <div className="divide-y divide-gray-100">
      <BookingsListHeader selectedDate={selectedDate} />
      
      <div className="divide-y divide-gray-100">
        {bookings.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Aucune réservation pour cette date
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingListItem
              key={booking.id}
              booking={booking}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
};