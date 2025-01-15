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

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('user_id', session.user.id)
          .is('deleted_at', null)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          throw error;
        }

        // Enrichir les données avec les informations du profil si disponibles
        const enrichedData = data.map(booking => {
          if (booking.profiles) {
            return {
              ...booking,
              user_name: booking.user_name || `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim(),
              user_email: booking.user_email || booking.profiles.email,
              user_phone: booking.user_phone || booking.profiles.phone
            };
          }
          return booking;
        });

        console.log('Final enriched bookings:', enrichedData);
        return enrichedData;
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