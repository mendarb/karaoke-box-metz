import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Booking } from "@/hooks/useBookings";
import { BookingStatusBadge } from "../../BookingStatusBadge";

export const getStatusColumn = (): ColumnDef<Booking> => ({
  accessorKey: "status",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-transparent"
    >
      Statut
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => (
    <BookingStatusBadge 
      status={row.getValue("status")} 
      paymentStatus={row.original.payment_status}
      isTestBooking={row.original.is_test_booking}
    />
  ),
});