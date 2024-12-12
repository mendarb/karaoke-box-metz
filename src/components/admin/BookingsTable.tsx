import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { Booking } from "@/hooks/useBookings";
import { useIsMobile } from "@/hooks/use-mobile";
import { createBookingColumns } from "./table/BookingTableColumns";
import { BookingTableContent } from "./table/BookingTableContent";

interface BookingsTableProps {
  data: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
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

  // Removed onStatusChange from createBookingColumns call since it's now handled by BookingActions directly
  const columns = createBookingColumns(isMobile, onViewDetails);

  const finalColumns = isMobile 
    ? columns.filter((col: ColumnDef<Booking>) => {
        let identifier: string | undefined;
        
        if ('id' in col && typeof col.id === 'string') {
          identifier = col.id;
        } else if ('accessorKey' in col && typeof col.accessorKey === 'string') {
          identifier = col.accessorKey;
        }
        
        return ["date", "user_name", "status", "actions"].includes(identifier || "");
      })
    : columns;

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