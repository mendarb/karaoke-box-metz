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
const RETRY_DELAY = 2000; // 2 secondes

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
          console.log('Pas de session_id trouvé dans l\'URL');
          setLoading(false);
          return;
        }

        console.log('🔍 Récupération des détails pour la session:', sessionId);

        // D'abord, récupérer le payment_intent_id via la session Stripe
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
          'get-payment-intent',
          {
            body: { sessionId }
          }
        );

        if (stripeError || !stripeData?.paymentIntentId) {
          console.error('❌ Erreur lors de la récupération du payment_intent:', stripeError);
          throw new Error(stripeError?.message || 'Impossible de récupérer les détails du paiement');
        }

        console.log('✅ Payment Intent ID récupéré:', stripeData.paymentIntentId);

        // Ensuite, récupérer la réservation avec le payment_intent_id
        const { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', stripeData.paymentIntentId)
          .maybeSingle();

        if (bookingError) {
          console.error('❌ Erreur lors de la récupération de la réservation:', bookingError);
          throw bookingError;
        }

        if (!bookings) {
          console.log('❌ Aucune réservation trouvée pour ce payment_intent_id');
          
          // Si on n'a pas atteint le nombre maximum de tentatives, on réessaie
          if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Nouvelle tentative dans ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => fetchBookingDetails(retryCount + 1), RETRY_DELAY);
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

        console.log('✅ Réservation trouvée:', bookings);
        setBookingDetails(bookings);
          
        // Envoyer l'email de confirmation si le paiement est confirmé
        if (bookings.payment_status === 'paid') {
          console.log('📧 Envoi de l\'email de confirmation pour la réservation:', bookings.id);
          try {
            await sendEmail(bookings);
            console.log('✅ Email de confirmation envoyé avec succès');
            toast({
              title: "Confirmation envoyée",
              description: "Un email de confirmation vous a été envoyé.",
            });
          } catch (emailError) {
            console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
            toast({
              title: "Note",
              description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
              variant: "default",
            });
          }
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('❌ Erreur dans fetchBookingDetails:', error);
        
        // Si on n'a pas atteint le nombre maximum de tentatives, on réessaie
        if (retryCount < MAX_RETRIES) {
          console.log(`⏳ Nouvelle tentative dans ${RETRY_DELAY/1000}s (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => fetchBookingDetails(retryCount + 1), RETRY_DELAY);
          return;
        }
        
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de votre réservation",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId, sendEmail]);

  return { bookingDetails, loading };
};