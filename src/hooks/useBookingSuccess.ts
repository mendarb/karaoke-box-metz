import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export interface BookingDetails {
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  price: number;
  is_test_booking: boolean;
  payment_status: string;
}

export const useBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const bookingId = searchParams.get('booking_id');

        if (!sessionId && !bookingId) {
          console.error('No session ID or booking ID found in URL');
          navigate('/');
          return;
        }

        // Récupérer la session utilisateur
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.error('No user session found');
          toast({
            title: "Erreur",
            description: "Session utilisateur non trouvée",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Attendre que le webhook traite la réservation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Récupérer la dernière réservation
        const { data: booking, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching booking:', error);
          throw error;
        }

        if (booking) {
          console.log('Booking found:', booking);
          setBookingDetails({
            date: booking.date,
            time_slot: booking.time_slot,
            duration: booking.duration,
            group_size: booking.group_size,
            price: booking.price,
            is_test_booking: booking.is_test_booking,
            payment_status: booking.payment_status
          });
        } else {
          console.error('No booking found');
          toast({
            title: "Erreur",
            description: "Réservation non trouvée",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des détails de votre réservation.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [navigate, searchParams, toast]);

  return { bookingDetails, loading };
};