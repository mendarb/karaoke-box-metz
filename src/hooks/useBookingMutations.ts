import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Updating booking status:', { bookingId, newStatus });
      
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

      try {
        await sendBookingEmail(data);
      } catch (error) {
        console.error('Email sending error:', error);
        // Continue even if email fails
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};