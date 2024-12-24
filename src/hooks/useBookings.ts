import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "@/services/bookingService";
import { Booking } from "@/integrations/supabase/types/booking";

export { type Booking };

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
};