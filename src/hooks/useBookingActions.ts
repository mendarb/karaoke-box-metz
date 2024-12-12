import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BookingStatus } from "@/integrations/supabase/types/booking";

export const useBookingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setIsLoading(true);
    try {
      console.log('Updating booking status:', { bookingId, status });
      
      // First check if the booking exists
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking booking:', checkError);
        throw checkError;
      }

      if (!existingBooking) {
        throw new Error('Booking not found');
      }

      // If booking exists, update its status
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      console.log('Booking updated successfully:', data);

      // Invalider le cache pour forcer le rechargement des données
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });

      return data[0];
    } catch (error: any) {
      console.error('Erreur mise à jour réservation:', error);
      toast({
        title: "Erreur",
        description: error.message === 'Booking not found' 
          ? "Réservation introuvable" 
          : "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBookingStatus,
    isLoading
  };
};