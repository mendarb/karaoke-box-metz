import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingCache } from "./useBookingCache";
import { useBookingNotifications } from "./useBookingNotifications";

export const useBookingMutations = () => {
  const { sendEmail } = useBookingEmail();
  const { invalidateBookings } = useBookingCache();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Updating booking:', { bookingId, newStatus });
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Booking not found');
      }

      console.log('Booking updated successfully:', data);
      await sendEmail(data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Mutation successful, invalidating cache');
      invalidateBookings();
      notifySuccess();
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    console.log('Starting booking status update:', { bookingId, newStatus });
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};