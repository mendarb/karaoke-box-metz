import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { Booking } from "@/integrations/supabase/types/booking";
import { toast } from "./use-toast";

export const useBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { sendEmail } = useBookingEmail();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const getBookingDetails = async () => {
      try {
        console.log("🔍 Retrieving details for session:", sessionId);
        
        // First attempt: look for booking with payment_intent_id
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select()
          .eq("payment_intent_id", sessionId)
          .maybeSingle();

        if (bookingError) {
          console.error('Error fetching booking:', bookingError);
          throw bookingError;
        }

        if (!bookingData) {
          console.warn("⚠️ No booking found with payment_intent_id, searching recent pending bookings...");
          
          // Second attempt: get most recent pending booking
          const { data: recentBookings, error: recentError } = await supabase
            .from("bookings")
            .select()
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (recentError) {
            console.error('Error fetching recent bookings:', recentError);
            throw recentError;
          }

          if (!recentBookings) {
            throw new Error("No pending booking found");
          }

          // Update the booking with session info
          const { data: updatedBooking, error: updateError } = await supabase
            .from("bookings")
            .update({ 
              status: "confirmed",
              payment_status: "paid",
              payment_intent_id: sessionId,
              updated_at: new Date().toISOString()
            })
            .eq("id", recentBookings.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating booking:', updateError);
            throw updateError;
          }

          setBooking(updatedBooking);
          console.log("✅ Booking status updated to paid");

          if (!emailSent) {
            try {
              await sendEmail(updatedBooking);
              setEmailSent(true);
              toast({
                title: "Réservation confirmée",
                description: "Un email de confirmation vous a été envoyé",
              });
            } catch (emailError) {
              console.error('Error sending confirmation email:', emailError);
              toast({
                title: "Email non envoyé",
                description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
                variant: "destructive",
              });
            }
          }
        } else {
          setBooking(bookingData);
          
          if (!emailSent) {
            try {
              await sendEmail(bookingData);
              setEmailSent(true);
              toast({
                title: "Réservation confirmée",
                description: "Un email de confirmation vous a été envoyé",
              });
            } catch (emailError) {
              console.error('Error sending confirmation email:', emailError);
              toast({
                title: "Email non envoyé",
                description: "La réservation est confirmée mais l'email n'a pas pu être envoyé",
                variant: "destructive",
              });
            }
          }
        }

      } catch (error: any) {
        console.error("Error retrieving booking:", error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de votre réservation",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, emailSent, sendEmail]);

  return { booking, isLoading, error };
};