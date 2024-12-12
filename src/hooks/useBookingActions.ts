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
      if (!['pending', 'confirmed', 'cancelled', 'archived'].includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

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

  const deleteBooking = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Succès",
        description: "La réservation a été supprimée",
      });
    } catch (error: any) {
      console.error('Delete failed:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
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