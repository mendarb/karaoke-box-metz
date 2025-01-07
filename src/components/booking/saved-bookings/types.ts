export interface SavedBooking {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  message?: string;
  isAvailable?: boolean;
  cabin: string;
}