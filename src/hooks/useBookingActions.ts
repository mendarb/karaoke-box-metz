import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useBookingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });
    } catch (error) {
      console.error('Erreur mise à jour réservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBookingStatus,
    isLoading
  };
};