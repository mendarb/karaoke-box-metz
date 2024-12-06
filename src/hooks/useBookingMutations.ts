import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    // Récupérer les données actuelles avant la mise à jour
    const previousBookings = queryClient.getQueryData<Booking[]>(['bookings']) || [];
    
    try {
      // Mettre à jour l'interface de manière optimiste
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      // Vérifier d'abord si la réservation existe
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId);

      if (fetchError) throw fetchError;
      
      if (!existingBooking || existingBooking.length === 0) {
        throw new Error("Réservation non trouvée");
      }

      // Effectuer la mise à jour dans Supabase
      const { error: updateError, data } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Mettre à jour le cache avec les données réelles
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
      
      // Restaurer l'état précédent en cas d'erreur
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