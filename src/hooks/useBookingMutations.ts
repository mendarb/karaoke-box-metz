import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    console.log('Updating booking status:', { bookingId, newStatus });
    
    try {
      // Check session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      // Check if user is admin
      const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
      if (!isAdmin) {
        throw new Error('Permission refusée');
      }

      // First check if booking exists
      const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId);

      if (fetchError) throw fetchError;

      if (!bookings || bookings.length === 0) {
        throw new Error('Cette réservation n\'existe plus');
      }

      // Update booking status
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      console.log('Sending email notification for status change');
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: newStatus === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled',
          booking: {
            ...data,
            status: newStatus
          }
        }
      });

      // Update cache
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

    } catch (error: any) {
      console.error('Error in updateBookingStatus:', error);
      
      // Handle specific error cases
      const errorMessage = error.message === 'Cette réservation n\'existe plus'
        ? error.message
        : "Une erreur est survenue lors de la mise à jour";

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      // Refresh data to ensure UI is in sync
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return {
    updateBookingStatus,
  };
};