import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";

export const useBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { sendBookingEmail } = useBookingEmail();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const getBookingDetails = async () => {
      try {
        console.log("🔍 Retrieving details for session:", sessionId);
        
        // Rechercher d'abord par payment_intent_id
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("payment_intent_id", sessionId)
          .single();

        if (bookingError || !bookingData) {
          console.warn("⚠️ No booking found with payment_intent_id, searching recent pending bookings...");
          
          // Si non trouvé, rechercher parmi les réservations récentes en attente
          const { data: recentBookings, error: recentError } = await supabase
            .from("bookings")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (recentError || !recentBookings) {
            throw new Error("Booking not found");
          }

          setBooking(recentBookings);
          
          // Mettre à jour le statut
          const { error: updateError } = await supabase
            .from("bookings")
            .update({ 
              status: "confirmed",
              payment_status: "paid",
              payment_intent_id: sessionId 
            })
            .eq("id", recentBookings.id);

          if (updateError) throw updateError;
          console.log("✅ Booking status updated to paid");
        } else {
          setBooking(bookingData);
        }

        // Envoyer l'email une seule fois
        if (!emailSent) {
          console.log("📧 Sending confirmation email for booking:", booking?.id);
          await sendBookingEmail(booking?.id);
          setEmailSent(true);
        }

      } catch (error: any) {
        console.error("Error retrieving booking:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, emailSent, sendBookingEmail]);

  return { booking, isLoading, error };
};