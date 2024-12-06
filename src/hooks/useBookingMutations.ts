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
      // First check if the booking exists and get its details
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        throw fetchError;
      }

      if (!existingBooking) {
        throw new Error('Réservation non trouvée ou accès non autorisé');
      }

      // Update the booking status
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Send email notification about the status change
      console.log('Sending email notification for status change');
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: data.user_email,
          userName: data.user_name,
          date: data.date,
          timeSlot: data.time_slot,
          duration: data.duration,
          groupSize: data.group_size,
          price: data.price,
          status: newStatus,
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw here, we still want to update the UI
        toast({
          title: "Attention",
          description: "Le statut a été mis à jour mais l'envoi de l'email a échoué.",
          variant: "warning",
        });
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