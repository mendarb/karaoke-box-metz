import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const previousBookings = queryClient.getQueryData<Booking[]>(['bookings']) || [];
    
    try {
      // First check if booking exists
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId)
        .maybeSingle();

      if (!existingBooking) {
        throw new Error("Réservation non trouvée");
      }

      // Optimistic update
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      // Update in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Update cache with actual data
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? data
            : booking
        );
      });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

    } catch (error: any) {
      console.error('Error updating booking status:', error);
      
      // Restore previous state on error
      queryClient.setQueryData(['bookings'], previousBookings);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  return { updateBookingStatus };
};