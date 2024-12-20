import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export interface BookingDateSettings {
  settings: BookingSettings | null;
  isLoading: boolean;
  minDate: Date;
  maxDate: Date;
}

export interface BookingSlot {
  time: string;
  isAvailable: boolean;
}

export interface BookingAvailability {
  date: Date;
  slots: BookingSlot[];
  maxDuration: number;
}