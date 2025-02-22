import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { BookingStatusBadge } from "../../BookingStatusBadge";
import { BookingActions } from "../../BookingActions";
import { BookingCustomerInfo } from "./BookingCustomerInfo";
import { BookingInfoBadges } from "./BookingInfoBadges";
import { Booking } from "@/hooks/useBookings";

interface BookingListItemProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export const BookingListItem = ({ 
  booking,
  onViewDetails 
}: BookingListItemProps) => {
  return (
    <div className="p-4 hover:bg-accent/5 transition-colors space-y-3">
      <div className="flex justify-between items-start gap-4">
        <BookingCustomerInfo
          name={booking.user_name}
          email={booking.user_email}
          phone={booking.user_phone}
        />
        <BookingStatusBadge status={booking.status as BookingStatus} />
      </div>

      <BookingInfoBadges
        timeSlot={booking.time_slot}
        duration={parseInt(booking.duration)}
        groupSize={booking.group_size}
        price={booking.price}
      />

      {booking.message && (
        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
          {booking.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(booking)}
          className="text-sm"
        >
          Détails
        </Button>
        <BookingActions 
          bookingId={booking.id}
          currentStatus={booking.status as BookingStatus}
        />
      </div>
    </div>
  );
};