import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Booking } from "@/hooks/useBookings";
import { getDateColumn } from "./columns/DateColumn";
import { getTimeColumn } from "./columns/TimeColumn";
import { getGroupColumn } from "./columns/GroupColumn";
import { getPriceColumn } from "./columns/PriceColumn";
import { getStatusColumn } from "./columns/StatusColumn";
import { getActionsColumn } from "./columns/ActionsColumn";
import { Checkbox } from "@/components/ui/checkbox";

export const createBookingColumns = (
  isMobile: boolean,
  onViewDetails: (booking: Booking) => void,
  enableSelection: boolean = false
): ColumnDef<Booking>[] => {
  const baseColumns = [
    getDateColumn(),
    getTimeColumn(),
    getGroupColumn(),
    getPriceColumn(),
    getStatusColumn(),
    getActionsColumn(isMobile, onViewDetails),
  ];

  if (enableSelection) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
      ...baseColumns,
    ];
  }

  return baseColumns;
};