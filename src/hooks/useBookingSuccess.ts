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

  useEffect(() => {
    let isSubscribed = true;
    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;

    const fetchBookingDetails = async () => {
      try {
        if (!sessionId || emailSent) {
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
          throw new Error(stripeError?.message || 'Unable to retrieve payment details');
        }

        // Rechercher la réservation par payment_intent_id
        let { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', stripeData.paymentIntentId)
          .maybeSingle();

        if (!booking) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            retryTimeout = setTimeout(fetchBookingDetails, RETRY_DELAY);
            return;
          }
          throw new Error('Booking not found');
        }

        if (isSubscribed) {
          setBookingDetails(booking);

          // Envoyer l'email seulement si le statut est confirmé et que l'email n'a pas déjà été envoyé
          if (booking.status === 'confirmed' && !emailSent) {
            try {
              await sendEmail(booking);
              setEmailSent(true);
              toast({
                title: "Confirmation envoyée",
                description: "Un email de confirmation vous a été envoyé.",
              });
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

        setLoading(false);
      } catch (error: any) {
        console.error('Error in fetchBookingDetails:', error);
        if (retryCount < MAX_RETRIES && !emailSent) {
          retryCount++;
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
  }, [sessionId, sendEmail, emailSent]);

  return { bookingDetails, loading };
};