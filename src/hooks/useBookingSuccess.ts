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

        // Then, get the booking with the payment_intent_id
        const { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', stripeData.paymentIntentId)
          .maybeSingle();

        if (bookingError) {
          console.error('❌ Error retrieving booking:', bookingError);
          throw bookingError;
        }

        if (!bookings) {
          console.log('❌ No booking found for this payment_intent_id');
          
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