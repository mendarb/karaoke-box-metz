import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingActions } from "./BookingActions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Booking = {
  id: string;
  created_at: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  status: string;
  price: number;
  message: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
};

interface BookingsTableProps {
  data: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
  onViewDetails: (booking: Booking) => void;
}

export const BookingsTable = ({ data, onStatusChange, onViewDetails }: BookingsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => format(new Date(row.getValue("date")), "d MMM yyyy", { locale: fr }),
    },
    {
      accessorKey: "user_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "time_slot",
      header: "Horaire",
      cell: ({ row }) => {
        const timeSlot = row.getValue("time_slot") as string;
        const duration = row.original.duration;
        return `${timeSlot}h - ${parseInt(timeSlot) + parseInt(duration)}h`;
      },
    },
    {
      accessorKey: "group_size",
      header: "Groupe",
      cell: ({ row }) => `${row.getValue("group_size")} pers.`,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prix
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => `${row.getValue("price")}€`,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <BookingStatusBadge status={row.getValue("status")} />,
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
            Détails
          </Button>
          <BookingActions
            bookingId={row.original.id}
            onStatusChange={onStatusChange}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucune réservation
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};