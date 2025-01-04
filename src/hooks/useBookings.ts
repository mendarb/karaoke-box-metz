import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings } from "@/services/bookingService";
import { Booking } from "@/integrations/supabase/types/booking";
import { supabase } from "@/lib/supabase";

export { type Booking };

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: Partial<Booking>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};