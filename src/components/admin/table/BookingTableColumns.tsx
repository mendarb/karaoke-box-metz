import { ColumnDef } from "@tanstack/react-table";
import { DateColumn } from "./columns/DateColumn";
import { TimeColumn } from "./columns/TimeColumn";
import { GroupColumn } from "./columns/GroupColumn";
import { PriceColumn } from "./columns/PriceColumn";
import { StatusColumn } from "./columns/StatusColumn";
import { ActionsColumn } from "./columns/ActionsColumn";

export type Booking = {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  price: number;
  status: string;
  payment_status: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  isTestBooking?: boolean;
};

export const columns: ColumnDef<Booking>[] = [
  DateColumn,
  TimeColumn,
  GroupColumn,
  PriceColumn,
  StatusColumn,
  ActionsColumn,
];