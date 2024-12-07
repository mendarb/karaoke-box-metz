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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Session expirée');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "mendar.bouchali@gmail.com") {
        throw new Error('Accès refusé');
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Réservation non trouvée');

      await sendEmail(data);
      return data;
    },
    onSuccess: () => {
      invalidateBookings();
      notifySuccess();
    },
    onError: (error: Error) => {
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};