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
        // Vérifier l'accès admin
        await verifyAdminAccess();
        
        // Vérifier d'abord si la réservation existe
        const { data: existingBooking, error: checkError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (checkError) {
          console.error('Error checking booking:', checkError);
          throw new Error('Réservation introuvable');
        }

        console.log('Found existing booking:', existingBooking);

        // Mettre à jour la réservation
        const { data, error } = await supabase
          .from('bookings')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (error) {
          console.error('Error updating booking:', error);
          throw new Error(error.message);
        }

        console.log('Successfully updated booking:', data);

        // Envoyer l'email
        try {
          await sendBookingEmail(data);
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // On continue même si l'email échoue
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
      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [updatedBooking];
        return old.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });

      // Invalider la requête pour forcer un rafraîchissement
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