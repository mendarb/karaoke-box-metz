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

export const useBookingSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { sendEmail } = useBookingEmail();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!sessionId) {
          console.log('Pas de session_id trouvé dans l\'URL');
          setLoading(false);
          return;
        }

        console.log('Recherche de la réservation avec le payment_intent_id:', sessionId);

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', sessionId)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la récupération de la réservation:', error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails de votre réservation",
            variant: "destructive",
          });
          throw error;
        }

        if (!bookings) {
          console.log('Aucune réservation trouvée pour ce payment_intent_id');
          setLoading(false);
          return;
        }

        console.log('Réservation trouvée:', bookings);
        setBookingDetails(bookings);
          
        // Envoyer l'email de confirmation si le paiement est confirmé
        if (bookings.payment_status === 'paid') {
          console.log('📧 Envoi de l\'email de confirmation pour la réservation:', bookings.id);
          try {
            await sendEmail(bookings);
            console.log('✅ Email de confirmation envoyé avec succès');
          } catch (emailError) {
            console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
          }
        }
      } catch (error) {
        console.error('Erreur dans fetchBookingDetails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId, sendEmail]);

  return { bookingDetails, loading };
};