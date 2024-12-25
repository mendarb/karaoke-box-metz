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

    // Si on a déjà tenté d'envoyer l'email, ne pas réessayer
    if (hasAttemptedEmailSend) {
      return;
    }

    const getBookingDetails = async () => {
      try {
        console.log("🔍 Retrieving details for session:", sessionId);
        
        // Attendre un peu pour laisser le temps au webhook de mettre à jour la réservation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("payment_status", "paid")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (bookingError) {
          console.error("❌ Error fetching booking:", bookingError);
          throw bookingError;
        }

        if (!bookingData) {
          console.warn("⚠️ No booking found with session ID:", sessionId);
          throw new Error("Booking not found");
        }

        console.log("✅ Found booking:", bookingData);
        setBooking(bookingData);
        
        // Marquer qu'on a tenté d'envoyer l'email
        setHasAttemptedEmailSend(true);

        try {
          console.log("📧 Sending confirmation email for booking:", bookingData.id);
          await sendEmail(bookingData as Booking);
          toast({
            title: "Email envoyé",
            description: "Un email de confirmation vous a été envoyé",
          });
        } catch (emailError: any) {
          console.error("❌ Error sending confirmation email:", emailError);
          toast({
            title: "Erreur d'envoi d'email",
            description: "L'email n'a pas pu être envoyé, mais votre réservation est bien confirmée",
            variant: "destructive",
          });
        }

      } catch (error: any) {
        console.error("❌ Error retrieving booking:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, hasAttemptedEmailSend, sendEmail]);

  return { booking, isLoading, error };
};