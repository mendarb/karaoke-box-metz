import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "@/services/bookingService";

export interface Booking {
  id: string;
  user_id: string;
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
  payment_status: string;
  created_at: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
};