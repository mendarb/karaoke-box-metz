import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    console.log('Updating booking status:', { bookingId, newStatus });
    
    try {
      // Vérifier la session d'abord
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      // Vérifier si l'utilisateur est admin
      const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
      if (!isAdmin) {
        throw new Error('Permission refusée');
      }

      // Mettre à jour le statut
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Envoyer l'email de notification
      console.log('Sending email notification for status change');
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: data.user_email,
          userName: data.user_name,
          date: data.date,
          timeSlot: data.time_slot,
          duration: data.duration,
          groupSize: data.group_size,
          price: data.price,
          status: newStatus,
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Note",
          description: "Le statut a été mis à jour mais l'envoi de l'email a échoué.",
          variant: "default",
        });
      }

      // Mettre à jour le cache
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [];
        return old.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

      // Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

    } catch (error: any) {
      console.error('Error updating booking status:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });

      // Rafraîchir les données pour s'assurer que l'UI est synchronisée
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return { updateBookingStatus };
};