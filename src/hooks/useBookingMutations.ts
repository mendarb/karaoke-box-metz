import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";

const verifyAdminAccess = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('Session error:', sessionError);
    throw new Error('Vous devez être connecté');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('User error:', userError);
    throw new Error('Utilisateur non trouvé');
  }

  if (user.email !== 'mendar.bouchali@gmail.com') {
    console.error('Not admin user:', user.email);
    throw new Error('Accès non autorisé');
  }

  return user;
};

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Starting booking status update:', { bookingId, newStatus });
      
      try {
        const user = await verifyAdminAccess();
        console.log('Admin access verified for user:', user.email);
        
        // First, check if the booking exists
        const { data: existingBooking, error: fetchError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (fetchError) {
          console.error('Error fetching booking:', fetchError);
          throw new Error("Réservation introuvable");
        }

        if (!existingBooking) {
          console.error('No booking found with id:', bookingId);
          throw new Error("Réservation introuvable");
        }

        // Then update it
        const { data: updatedBooking, error: updateError } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw new Error("Erreur lors de la mise à jour de la réservation");
        }

        if (!updatedBooking) {
          console.error('No booking returned after update');
          throw new Error("Erreur lors de la mise à jour de la réservation");
        }

        console.log('Successfully updated booking:', updatedBooking);

        try {
          await sendBookingEmail(updatedBooking);
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }

        return updatedBooking;
      } catch (error: any) {
        console.error('Mutation error:', error);
        throw new Error(error.message || "Une erreur est survenue");
      }
    },
    onError: (error: Error) => {
      console.error('Mutation error handler:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
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
        description: "Statut de la réservation mis à jour",
      });
    },
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return {
    updateBookingStatus,
  };
};