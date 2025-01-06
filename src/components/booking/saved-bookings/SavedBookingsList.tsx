import { SavedBookingCard } from "./SavedBookingCard";
import { SavedBookingsEmpty } from "./SavedBookingsEmpty";

interface SavedBookingsListProps {
  bookings: any[];
  onDelete: (id: string) => void;
  onContinue: (booking: any) => void;
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