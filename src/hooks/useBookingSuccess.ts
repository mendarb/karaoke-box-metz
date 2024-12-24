import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { toast } from "./use-toast";

export interface BookingDetails {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  price: number;
  user_email: string;
  user_name: string;
  user_phone: string;
  payment_status: string;
  is_test_booking?: boolean;
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

export const useBookingSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { sendEmail } = useBookingEmail();

  useEffect(() => {
    const fetchBookingDetails = async (retryCount = 0) => {
      try {
        if (!sessionId) {
          console.log('No session_id found in URL');
          setLoading(false);
          return;
        }

        console.log('🔍 Retrieving details for session:', sessionId);

        // First, get the payment_intent_id via Stripe session
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
          'get-payment-intent',
          {
            body: { sessionId }
          }
        );

        if (stripeError || !stripeData?.paymentIntentId) {
          console.error('❌ Error retrieving payment_intent:', stripeError);
          throw new Error(stripeError?.message || 'Unable to retrieve payment details');
        }

        console.log('✅ Payment Intent ID retrieved:', stripeData.paymentIntentId);

        // Rechercher d'abord par payment_intent_id
        let { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', stripeData.paymentIntentId)
          .maybeSingle();

        // Si aucune réservation n'est trouvée, chercher les réservations récentes en attente
        if (!bookings) {
          console.log('⚠️ No booking found with payment_intent_id, searching recent pending bookings...');
          const { data: pendingBookings, error: pendingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('payment_status', 'awaiting_payment')
            .order('created_at', { ascending: false })
            .limit(1);

          if (pendingError) {
            console.error('❌ Error retrieving pending bookings:', pendingError);
            throw pendingError;
          }

          bookings = pendingBookings?.[0] || null;
        }

        if (!bookings) {
          console.log('❌ No booking found');
          
          if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Retrying in ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => fetchBookingDetails(retryCount + 1), RETRY_DELAY);
            return;
          }
          
          toast({
            title: "Error",
            description: "Unable to find your booking. The technical team has been notified.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('✅ Booking found:', bookings);
        setBookingDetails(bookings);
        
        // Mettre à jour le statut de la réservation si nécessaire
        if (bookings.payment_status !== 'paid') {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              payment_intent_id: stripeData.paymentIntentId
            })
            .eq('id', bookings.id);

          if (updateError) {
            console.error('❌ Error updating booking status:', updateError);
          } else {
            console.log('✅ Booking status updated to paid');
          }
        }

        if (bookings.payment_status === 'paid') {
          console.log('📧 Sending confirmation email for booking:', bookings.id);
          try {
            await sendEmail(bookings);
            console.log('✅ Confirmation email sent successfully');
            toast({
              title: "Confirmation sent",
              description: "A confirmation email has been sent to you.",
            });
          } catch (emailError) {
            console.error('❌ Error sending confirmation email:', emailError);
            toast({
              title: "Note",
              description: "The booking is confirmed but the email could not be sent",
              variant: "default",
            });
          }
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('❌ Error in fetchBookingDetails:', error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`⏳ Retrying in ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => fetchBookingDetails(retryCount + 1), RETRY_DELAY);
          return;
        }
        
        toast({
          title: "Error",
          description: "An error occurred while retrieving your booking",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId, sendEmail]);

  return { bookingDetails, loading };
};