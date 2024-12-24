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
  const [emailSent, setEmailSent] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    let retryCount = 0;
    let processingTimeout: NodeJS.Timeout;

    const fetchBookingDetails = async () => {
      try {
        if (!sessionId || processingComplete) {
          console.log('No session_id found in URL or processing already complete');
          setLoading(false);
          return;
        }

        console.log('🔍 Retrieving details for session:', sessionId);

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
          if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Retrying in ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
            retryCount++;
            processingTimeout = setTimeout(fetchBookingDetails, RETRY_DELAY);
            return;
          }
          
          toast({
            title: "Erreur",
            description: "Impossible de trouver votre réservation. L'équipe technique a été notifiée.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('✅ Booking found:', bookings);
        
        if (isSubscribed) {
          setBookingDetails(bookings);
        }
        
        // Ne mettre à jour le statut que si nécessaire
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

        // N'envoyer l'email qu'une seule fois
        if (bookings.payment_status === 'paid' && !emailSent && isSubscribed) {
          console.log('📧 Sending confirmation email for booking:', bookings.id);
          try {
            await sendEmail(bookings);
            if (isSubscribed) {
              setEmailSent(true);
            }
            console.log('✅ Confirmation email sent successfully');
            toast({
              title: "Confirmation envoyée",
              description: "Un email de confirmation vous a été envoyé.",
            });
          } catch (emailError) {
            console.error('❌ Error sending confirmation email:', emailError);
            toast({
              title: "Note",
              description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
              variant: "default",
            });
          }
        }
        
        if (isSubscribed) {
          setLoading(false);
          setProcessingComplete(true);
        }
      } catch (error: any) {
        console.error('❌ Error in fetchBookingDetails:', error);
        
        if (retryCount < MAX_RETRIES && isSubscribed && !processingComplete) {
          console.log(`⏳ Retrying in ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
          retryCount++;
          processingTimeout = setTimeout(fetchBookingDetails, RETRY_DELAY);
          return;
        }
        
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de votre réservation",
          variant: "destructive",
        });
        if (isSubscribed) {
          setLoading(false);
          setProcessingComplete(true);
        }
      }
    };

    fetchBookingDetails();

    return () => {
      isSubscribed = false;
      clearTimeout(processingTimeout);
    };
  }, [sessionId, sendEmail, emailSent]);

  return { bookingDetails, loading };
};