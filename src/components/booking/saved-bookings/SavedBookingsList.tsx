import { SavedBookingCard } from "./SavedBookingCard";
import { SavedBookingsEmpty } from "./SavedBookingsEmpty";
import { SavedBooking } from "./hooks/useSavedBookings";

interface SavedBookingsListProps {
  bookings: SavedBooking[];
  onDelete: (id: string) => void;
  onContinue: (booking: SavedBooking) => void;
}

export const SavedBookingsList = ({ bookings, onDelete, onContinue }: SavedBookingsListProps) => {
  if (bookings.length === 0) {
    return <SavedBookingsEmpty />;
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
      {bookings.map((booking) => (
        <SavedBookingCard
          key={booking.id}
          booking={booking}
          onDelete={onDelete}
          onContinue={onContinue}
        />
      ))}
    </div>
  );
};