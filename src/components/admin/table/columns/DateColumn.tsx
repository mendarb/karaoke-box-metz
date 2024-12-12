import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Booking } from "@/hooks/useBookings";

export const getDateColumn = (): ColumnDef<Booking> => ({
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
});