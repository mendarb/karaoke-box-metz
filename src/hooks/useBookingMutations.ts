import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    console.log('Updating booking status:', { bookingId, newStatus });
    
    try {
      // First check if the booking exists and is accessible
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        if (fetchError.code === 'PGRST116') {
          throw new Error('Réservation non trouvée ou accès non autorisé');
        }
        throw fetchError;
      }

      if (!existingBooking) {
        throw new Error('Réservation non trouvée');
      }

      // If we found the booking, proceed with the update
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating booking:', updateError);
        throw updateError;
      }

      // Update cache optimistically
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

      // Invalidate and refetch to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

    } catch (error: any) {
      console.error('Error updating booking status:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });

      // Refresh the data to ensure UI is in sync
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return { updateBookingStatus };
};