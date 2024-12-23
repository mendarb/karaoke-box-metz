import React, { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { Booking } from "@/hooks/useBookings";
import { useIsMobile } from "@/hooks/use-mobile";
import { createBookingColumns } from "./table/BookingTableColumns";
import { BookingTableContent } from "./table/BookingTableContent";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useBookingActions } from "@/hooks/useBookingActions";

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
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: false }
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { deleteBooking } = useBookingActions();

  const columns = createBookingColumns(isMobile, onViewDetails, true);

  const finalColumns = isMobile 
    ? columns.filter((col: ColumnDef<Booking>) => {
        let identifier: string | undefined;
        
        if ('id' in col && typeof col.id === 'string') {
          identifier = col.id;
        } else if ('accessorKey' in col && typeof col.accessorKey === 'string') {
          identifier = col.accessorKey;
        }
        
        return ["select", "date", "user_name", "status", "actions"].includes(identifier || "");
      })
    : columns;

  const table = useReactTable({
    data: data || [],
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
  });

  const handleDeleteSelected = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      if (selectedRows.length === 0) {
        toast({
          title: "Aucune réservation sélectionnée",
          description: "Veuillez sélectionner au moins une réservation à supprimer",
          variant: "destructive",
        });
        return;
      }

      for (const row of selectedRows) {
        await deleteBooking(row.original.id);
      }

      setRowSelection({});
      toast({
        title: "Succès",
        description: `${selectedRows.length} réservation(s) supprimée(s)`,
      });
    } catch (error) {
      console.error('Error deleting bookings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des réservations",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={Object.keys(rowSelection).length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer la sélection
        </Button>
      </div>
      
      <div className="rounded-md border bg-white">
        <BookingTableContent 
          table={table} 
          columnCount={finalColumns.length}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};