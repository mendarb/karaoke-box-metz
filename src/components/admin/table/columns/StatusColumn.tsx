import { ColumnDef } from "@tanstack/react-table";
import { BookingStatusBadge } from "../../BookingStatusBadge";
import type { Booking } from "../BookingTableColumns";

export const StatusColumn: ColumnDef<Booking> = {
  accessorKey: "status",
  header: "Statut",
  cell: ({ row }) => {
    const booking = row.original;
    return (
      <BookingStatusBadge 
        status={booking.status} 
        paymentStatus={booking.payment_status}
        isTestBooking={booking.isTestBooking}
      />
    );
  },
};