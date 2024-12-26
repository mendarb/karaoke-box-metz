import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useBookingHistory = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No session found');
          throw new Error('No session found');
        }

        console.log('Fetching bookings for user:', session.user.id);

        // Vérifions d'abord si l'utilisateur a des réservations sans filtres
        const { data: allBookings, error: allBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id);

        console.log('All bookings (without deleted_at filter):', allBookings);

        // Vérifions maintenant avec le filtre de status
        const { data: pendingBookings, error: pendingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'pending');

        console.log('Pending bookings:', pendingBookings);

        // Maintenant la requête finale avec tous les filtres
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .is('deleted_at', null)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          throw error;
        }

        console.log('Final filtered bookings:', data);
        return data;
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
    retry: false,
  });
};