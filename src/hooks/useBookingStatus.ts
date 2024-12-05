import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sendBookingEmail } from "@/services/emailService";

export const useBookingStatus = (onStatusUpdated: () => Promise<void>) => {
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        toast({
          title: "Succès",
          description: "Statut de la réservation mis à jour",
        });
        await sendBookingEmail(data);
        await onStatusUpdated();
      } else {
        toast({
          title: "Erreur",
          description: "Réservation non trouvée",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  return { updateBookingStatus };
};