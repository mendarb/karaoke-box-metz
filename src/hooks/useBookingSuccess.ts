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

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const useBookingSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { sendEmail } = useBookingEmail();
  const [emailSent, setEmailSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchBookingDetails = async () => {
      try {
        if (!sessionId || emailSent) {
          setLoading(false);
          return;
        }

        console.log('🔍 Retrieving details for session:', sessionId);

        // Récupérer le payment_intent_id depuis la session Stripe
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
          'get-payment-intent',
          {
            body: { sessionId }
          }
        );

        if (stripeError || !stripeData?.paymentIntentId) {
          throw new Error(stripeError?.message || 'Unable to retrieve payment details');
        }

        // Rechercher la réservation par payment_intent_id
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', stripeData.paymentIntentId)
          .maybeSingle();

        if (!booking) {
          console.log('⚠️ No booking found with payment_intent_id, searching recent pending bookings...');
          
          // Rechercher parmi les réservations récentes en attente
          const { data: pendingBooking, error: pendingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('payment_status', 'awaiting_payment')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (pendingError || !pendingBooking) {
            if (retryCount < MAX_RETRIES) {
              console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
              setRetryCount(prev => prev + 1);
              retryTimeout = setTimeout(fetchBookingDetails, RETRY_DELAY);
              return;
            }
            throw new Error('Booking not found');
          }

          // Mettre à jour la réservation avec le payment_intent_id
          const { data: updatedBooking, error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_intent_id: stripeData.paymentIntentId,
              payment_status: 'paid',
              status: 'confirmed',
              updated_at: new Date().toISOString()
            })
            .eq('id', pendingBooking.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          console.log('✅ Booking status updated to paid');
          
          if (isSubscribed) {
            setBookingDetails(updatedBooking);
            
            if (!emailSent) {
              try {
                console.log('📧 Sending confirmation email for booking:', updatedBooking.id);
                await sendEmail(updatedBooking);
                setEmailSent(true);
                console.log('✅ Confirmation email sent successfully');
              } catch (emailError) {
                console.error('Error sending confirmation email:', emailError);
                toast({
                  title: "Note",
                  description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
                  variant: "default",
                });
              }
            }
          }
        } else {
          console.log('✅ Booking found:', booking);
          
          if (isSubscribed) {
            setBookingDetails(booking);
            
            if (booking.status === 'confirmed' && !emailSent) {
              try {
                console.log('📧 Sending confirmation email for booking:', booking.id);
                await sendEmail(booking);
                setEmailSent(true);
                console.log('✅ Confirmation email sent successfully');
              } catch (emailError) {
                console.error('Error sending confirmation email:', emailError);
                toast({
                  title: "Note",
                  description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
                  variant: "default",
                });
              }
            }
          }
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error in fetchBookingDetails:', error);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          retryTimeout = setTimeout(fetchBookingDetails, RETRY_DELAY);
          return;
        }
        
        if (isSubscribed) {
          setLoading(false);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la récupération de votre réservation",
            variant: "destructive",
          });
        }
      }
    };

    fetchBookingDetails();

    return () => {
      isSubscribed = false;
      clearTimeout(retryTimeout);
    };
  }, [sessionId, sendEmail, emailSent, retryCount]);

  return { bookingDetails, loading };
};