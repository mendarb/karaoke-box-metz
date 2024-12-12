import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Succès",
        description: "La réservation a été mise à jour",
      });
    },
    onError: (error: Error) => {
      console.error('Erreur mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
    },
  });

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await mutation.mutateAsync({ bookingId, newStatus });
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  };

  return { updateStatus, isLoading: mutation.isPending };
};