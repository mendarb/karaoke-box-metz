import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";

export const useBookingHistory = () => {
  const { toast } = useToast();
  const { user } = useUserState();

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      try {
        if (!user) {
          console.log('No user found, returning empty array');
          return [];
        }

        console.log('Fetching bookings for user:', user.id);

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            date,
            time_slot,
            duration,
            group_size,
            price,
            status,
            payment_status,
            payment_method,
            is_test_booking,
            invoice_url
          `)
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          throw error;
        }

        console.log('Bookings fetched successfully:', data);
        return data || [];
      } catch (error: any) {
        console.error('Error in useBookingHistory:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réservations",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!user,
  });
};