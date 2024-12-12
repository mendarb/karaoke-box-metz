import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BookingStatus } from "@/integrations/supabase/types/booking";

export const useBookingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setIsLoading(true);
    console.log('Starting status update:', { bookingId, newStatus });

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });

      return data;
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

  const deleteBooking = async (bookingId: string) => {
    setIsLoading(true);
    console.log('Starting deletion:', { bookingId });
    
    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      console.log('Deletion successful');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "La réservation a été supprimée",
      });
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la réservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBookingStatus,
    deleteBooking,
    isLoading
  };
};