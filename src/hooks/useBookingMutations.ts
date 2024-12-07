import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";
import { sendBookingEmail } from "@/services/emailService";
import { verifyAdminAccess } from "@/services/bookingService";
import { supabase } from "@/lib/supabase";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string, newStatus: string }) => {
      console.log('Starting booking status update:', { bookingId, newStatus });
      
      try {
        await verifyAdminAccess();
        
        const { data, error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select()
          .maybeSingle();

        if (error) {
          console.error('Error updating booking:', error);
          throw new Error("Erreur lors de la mise à jour de la réservation");
        }

        if (!data) {
          console.error('No booking found with id:', bookingId);
          throw new Error("Réservation introuvable");
        }

        console.log('Successfully updated booking:', data);

        try {
          await sendBookingEmail(data);
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }

        return data;

      } catch (error: any) {
        console.error('Error in updateBookingStatus:', error);
        
        if (error.message.includes('Session expirée')) {
          await supabase.auth.signOut();
          window.location.reload();
        }
        
        throw error;
      }
    },
    onSuccess: (updatedBooking) => {
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [updatedBooking];
        return old.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });

      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    return updateBookingMutation.mutateAsync({ bookingId, newStatus });
  };

  return {
    updateBookingStatus,
  };
};