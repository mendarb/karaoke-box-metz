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

      // Effectuer la mise à jour dans Supabase
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select('*')
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      if (!updatedBooking) {
        throw new Error('La réservation n\'a pas pu être mise à jour');
      }

      console.log('Successfully updated booking:', updatedBooking);

      // Mettre à jour le cache avec la nouvelle donnée
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [updatedBooking];
        return old.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        );
      });

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

      // Rafraîchir les données en cas d'erreur
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return {
    updateBookingStatus,
  };
};