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
        
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("payment_status", "paid")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (bookingError) {
          console.error("❌ Erreur lors de la récupération de la réservation:", bookingError);
          throw bookingError;
        }

        if (!bookingData) {
          console.warn("⚠️ Aucune réservation trouvée pour la session:", sessionId);
          throw new Error("Réservation non trouvée");
        }

        console.log("✅ Réservation trouvée:", {
          id: bookingData.id,
          date: bookingData.date,
          timeSlot: bookingData.time_slot,
          duration: bookingData.duration,
          groupSize: bookingData.group_size
        });

        setBooking(bookingData);
        setHasAttemptedEmailSend(true);

        try {
          console.log("📧 Envoi de l'email de confirmation pour la réservation:", bookingData.id);
          await sendEmail(bookingData as Booking);
          toast({
            title: "Email envoyé",
            description: "Un email de confirmation vous a été envoyé",
          });
        } catch (emailError: any) {
          console.error("❌ Erreur lors de l'envoi de l'email de confirmation:", emailError);
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