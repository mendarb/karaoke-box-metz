import { ColumnDef } from "@tanstack/react-table";
import { getDateColumn } from "./columns/DateColumn";
import { getTimeColumn } from "./columns/TimeColumn";
import { getGroupColumn } from "./columns/GroupColumn";
import { getPriceColumn } from "./columns/PriceColumn";
import { getStatusColumn } from "./columns/StatusColumn";
import { getActionsColumn } from "./columns/ActionsColumn";
import { Booking } from "@/hooks/useBookings";

export const createBookingColumns = (
  isMobile: boolean,
  onViewDetails: (booking: Booking) => void
): ColumnDef<Booking>[] => [
  getDateColumn(),
  getTimeColumn(),
  getGroupColumn(),
  getPriceColumn(),
  getStatusColumn(),
  getActionsColumn(isMobile, onViewDetails),
];