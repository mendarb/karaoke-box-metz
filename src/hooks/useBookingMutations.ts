import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "@/services/bookingService";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }) => {
      return await updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: (updatedBooking) => {
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