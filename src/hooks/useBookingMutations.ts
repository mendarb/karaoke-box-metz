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
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Session error: ' + sessionError.message);
      }
      
      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      // Check if user is admin
      const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
      if (!isAdmin) {
        throw new Error('Permission refusée');
      }

      // First check if booking exists
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        if (fetchError.code === 'PGRST116') {
          throw new Error('Cette réservation n\'existe plus ou a été supprimée');
        }
        throw fetchError;
      }

      if (!existingBooking) {
        throw new Error('Réservation non trouvée');
      }

      // Update booking status
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
        throw new Error('Erreur lors de la mise à jour');
      }

      // Send email notification
      console.log('Sending email notification for status change');
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          type: newStatus === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled',
          booking: {
            ...data,
            status: newStatus
          }
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Attention",
          description: "Le statut a été mis à jour mais l'email n'a pas pu être envoyé",
          variant: "destructive",
        });
      }

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
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
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