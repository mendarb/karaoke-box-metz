import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export interface BookingDateConfig {
  settings: BookingSettings | null;
  minDate: Date;
  maxDate: Date;
  isTestMode: boolean;
}

export interface BookingSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  maxDuration: number;
}