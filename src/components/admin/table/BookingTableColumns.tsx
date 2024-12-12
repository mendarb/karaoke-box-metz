import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../BookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";

export const createBookingColumns = (
  isMobile: boolean,
  onViewDetails: (booking: Booking) => void,
): ColumnDef<Booking>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.getValue("date")), "d MMM yyyy", { locale: fr }),
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Client
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "time_slot",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Horaire
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const timeSlot = row.getValue("time_slot") as string;
      const duration = row.original.duration;
      const startHour = timeSlot;
      const endHour = parseInt(timeSlot) + parseInt(duration);
      return `${startHour}:00 - ${endHour}:00`;
    },
  },
  {
    accessorKey: "group_size",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Groupe
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.getValue("group_size")} pers.`,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Prix
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.getValue("price")}€`,
  },
  {
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
    cell: ({ row }) => <BookingStatusBadge status={row.getValue("status") as BookingStatus} />,
  },
  {
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
  },
];