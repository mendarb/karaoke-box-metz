import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Booking } from "@/hooks/useBookings";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { BookingActions } from "../../BookingActions";

export const getActionsColumn = (
  isMobile: boolean,
  onViewDetails: (booking: Booking) => void
): ColumnDef<Booking> => ({
  id: "actions",
  cell: ({ row }) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(row.original)}
      >
        {isMobile ? "Voir" : "Détails"}
      </Button>
      <BookingActions 
        bookingId={row.original.id} 
        currentStatus={row.original.status as BookingStatus}
      />
    </div>
  ),
});