import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const updateStatus = async (bookingId: string, newStatus: string) => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateStatus, isLoading: mutation.isPending };
};