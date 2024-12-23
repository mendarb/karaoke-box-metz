import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";

export const useBookingSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { sendEmail } = useBookingEmail();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!sessionId) {
          setLoading(false);
          return;
        }

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', sessionId)
          .single();

        if (error) {
          console.error('Error fetching booking:', error);
          throw error;
        }

        if (bookings) {
          setBookingDetails(bookings);
          
          // Envoyer l'email de confirmation si le paiement est confirmé
          if (sessionId) {
            console.log('📧 Sending confirmation email for booking:', bookings.id);
            try {
              await sendEmail(bookings);
              console.log('✅ Confirmation email sent successfully');
            } catch (emailError) {
              console.error('❌ Error sending confirmation email:', emailError);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchBookingDetails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId, sendEmail]);

  return { bookingDetails, loading };
};