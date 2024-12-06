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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
      if (!isAdmin) {
        throw new Error('Permission refusée');
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

    } catch (error: any) {
      console.error('Error in updateBookingStatus:', error);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
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