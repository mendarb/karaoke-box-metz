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
    console.log('Starting status update:', { bookingId, status });

    try {
      // Vérification explicite du type de statut
      if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // Mise à jour directe avec le nouveau statut
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No booking found or update failed');
      }

      console.log('Update successful:', data[0]);

      // Force le rechargement des données
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });

      return data[0];
    } catch (error: any) {
      console.error('Update failed:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
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