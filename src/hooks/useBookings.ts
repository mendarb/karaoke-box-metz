import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export type Booking = {
  id: string;
  created_at: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  status: string;
  price: number;
  message: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter pour accéder aux réservations.",
          variant: "destructive",
        });
        return;
      }

      if (!session) {
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté pour voir les réservations.",
          variant: "destructive",
        });
        return;
      }

      // Add console logs to track the request
      console.log('Fetching bookings with session:', session.access_token);
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      console.log('Bookings fetched successfully:', bookingsData);
      setBookings(bookingsData || []);
      
    } catch (error: any) {
      console.error('Error in fetchBookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on mount and when auth state changes
  useEffect(() => {
    const setupInitialFetch = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('Auth state changed, fetching bookings');
          fetchBookings();
        }
      });

      // Initial fetch
      await fetchBookings();

      // Cleanup
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    setupInitialFetch();
  }, []);

  return {
    bookings,
    isLoading,
    fetchBookings,
  };
};