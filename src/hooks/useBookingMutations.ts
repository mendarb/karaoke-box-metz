import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // Mise à jour optimiste
      queryClient.setQueryData(['bookings'], (oldData: Booking[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

      // Invalider et recharger les données
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      // Recharger les données en cas d'erreur
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return { updateBookingStatus };
};