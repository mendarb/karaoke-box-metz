import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Booking } from "@/hooks/useBookings";
import { useIsMobile } from "@/hooks/use-mobile";
import { createBookingColumns } from "./table/BookingTableColumns";
import { BookingTableContent } from "./table/BookingTableContent";

interface BookingsTableProps {
  data: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => Promise<Booking>;
  onViewDetails: (booking: Booking) => void;
  isLoading?: boolean;
}

export const BookingsTable = ({ 
  data, 
  onStatusChange, 
  onViewDetails,
  isLoading = false 
}: BookingsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const isMobile = useIsMobile();

  const columns = createBookingColumns(isMobile, onViewDetails, onStatusChange);

  // Si on est sur mobile, on réduit les colonnes affichées
  const mobileColumns = columns.filter(col => {
    const identifier = typeof col.id === 'string' ? col.id : 
                      typeof col.accessorKey === 'string' ? col.accessorKey : 
                      undefined;
    return ["date", "user_name", "status", "actions"].includes(identifier || "");
  });

  const finalColumns = isMobile ? mobileColumns : columns;

  const table = useReactTable({
    data: data || [],
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <BookingTableContent 
        table={table} 
        columnCount={finalColumns.length}
        isMobile={isMobile}
      />
    </div>
  );
};