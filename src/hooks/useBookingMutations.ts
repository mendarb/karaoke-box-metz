import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    console.log('Starting booking status update:', { bookingId, newStatus });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
      if (!isAdmin) {
        throw new Error('Permission refusée');
      }

      // Optimistic update
      const previousBookings = queryClient.getQueryData<Booking[]>(['bookings']);
      const bookingToUpdate = previousBookings?.find(b => b.id === bookingId);

      if (!bookingToUpdate) {
        throw new Error('Réservation non trouvée');
      }

      // Update local cache optimistically
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      // Perform the actual update
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Update error:', updateError);
        // Revert optimistic update on error
        queryClient.setQueryData(['bookings'], previousBookings);
        throw updateError;
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-booking-email', {
          body: {
            type: newStatus === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled',
            booking: {
              ...bookingToUpdate,
              status: newStatus
            }
          }
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw here as the status update was successful
        toast({
          title: "Attention",
          description: "Le statut a été mis à jour mais l'envoi de l'email a échoué",
          variant: "warning",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

    } catch (error: any) {
      console.error('Error in updateBookingStatus:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });

      // Refresh data in case of error to ensure UI is in sync
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return {
    updateBookingStatus,
  };
};