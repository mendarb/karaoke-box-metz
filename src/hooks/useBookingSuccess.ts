import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { Booking } from "@/integrations/supabase/types/booking";
import { toast } from "./use-toast";

export interface BookingDetails {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  price: number;
  payment_status: string;
  is_test_booking?: boolean;
  user_id?: string;
  status?: string;
  message?: string;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
}

export const useBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sendEmail } = useBookingEmail();
  const [hasAttemptedEmailSend, setHasAttemptedEmailSend] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      console.log("❌ Pas de session_id dans l'URL");
      setIsLoading(false);
      return;
    }

    if (hasAttemptedEmailSend) {
      return;
    }

    const getBookingDetails = async () => {
      try {
        console.log("🔍 Recherche de la réservation pour la session:", sessionId);
        
        // Attendre un peu pour laisser le temps au webhook de mettre à jour la réservation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Récupérer d'abord les détails de la session Stripe
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
          'get-payment-intent',
          {
            body: { sessionId }
          }
        );

        if (stripeError) {
          console.error("❌ Erreur lors de la récupération du payment_intent_id:", stripeError);
          throw new Error("Impossible de récupérer les détails du paiement");
        }

        if (!stripeData?.paymentIntentId) {
          console.error("❌ Pas de payment_intent_id retourné");
          throw new Error("Payment intent non trouvé");
        }

        console.log("💳 Payment Intent ID récupéré:", stripeData.paymentIntentId);
        
        // Récupérer la réservation avec le payment_intent_id
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("payment_intent_id", stripeData.paymentIntentId)
          .eq("payment_status", "paid")
          .is("deleted_at", null)  // S'assurer que la réservation n'est pas supprimée
          .maybeSingle();

        if (bookingError) {
          console.error("❌ Erreur lors de la récupération de la réservation:", bookingError);
          throw bookingError;
        }

        if (!bookingData) {
          console.warn("⚠️ Aucune réservation trouvée avec le payment_intent_id:", stripeData.paymentIntentId);
          
          // Essayer de récupérer la réservation la plus récente (fallback)
          console.log("🔍 Recherche de la réservation la plus récente");
          const { data: latestBooking, error: latestError } = await supabase
            .from("bookings")
            .select("*")
            .eq("payment_status", "paid")
            .is("deleted_at", null)  // S'assurer que la réservation n'est pas supprimée
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latestError) {
            console.error("❌ Erreur lors de la récupération de la dernière réservation:", latestError);
            throw latestError;
          }

          if (!latestBooking) {
            throw new Error("Aucune réservation trouvée");
          }

          console.log("✅ Réservation trouvée:", latestBooking);
          setBooking(latestBooking);
          setHasAttemptedEmailSend(true);

          try {
            await sendEmail(latestBooking as Booking);
            toast({
              title: "Email envoyé",
              description: "Un email de confirmation vous a été envoyé",
            });
          } catch (emailError: any) {
            console.error("❌ Erreur lors de l'envoi de l'email:", emailError);
            toast({
              title: "Erreur d'envoi d'email",
              description: "L'email n'a pas pu être envoyé, mais votre réservation est bien confirmée",
              variant: "destructive",
            });
          }

          return;
        }

        console.log("✅ Réservation trouvée:", {
          id: bookingData.id,
          date: bookingData.date,
          timeSlot: bookingData.time_slot,
          duration: bookingData.duration,
          groupSize: bookingData.group_size,
          price: bookingData.price
        });

        setBooking(bookingData);
        setHasAttemptedEmailSend(true);

        try {
          await sendEmail(bookingData as Booking);
          toast({
            title: "Email envoyé",
            description: "Un email de confirmation vous a été envoyé",
          });
        } catch (emailError: any) {
          console.error("❌ Erreur lors de l'envoi de l'email:", emailError);
          toast({
            title: "Erreur d'envoi d'email",
            description: "L'email n'a pas pu être envoyé, mais votre réservation est bien confirmée",
            variant: "destructive",
          });
        }

      } catch (error: any) {
        console.error("❌ Erreur lors de la récupération de la réservation:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, hasAttemptedEmailSend, sendEmail]);

  return { booking, isLoading, error };
};