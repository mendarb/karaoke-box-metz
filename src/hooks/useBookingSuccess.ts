import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { Booking } from "@/integrations/supabase/types/booking";

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
          .select("*")
          .eq("payment_intent_id", sessionId)
          .single();

        if (bookingError || !bookingData) {
          console.warn("⚠️ No booking found with payment_intent_id, searching recent pending bookings...");
          
          // Second attempt: get most recent pending booking
          const { data: recentBookings, error: recentError } = await supabase
            .from("bookings")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(1);

          if (recentError || !recentBookings?.length) {
            throw new Error("Booking not found");
          }

          const recentBooking = recentBookings[0];
          
          // Update the booking with session info
          const { error: updateError } = await supabase
            .from("bookings")
            .update({ 
              status: "confirmed",
              payment_status: "paid",
              payment_intent_id: sessionId,
              updated_at: new Date().toISOString()
            })
            .eq("id", recentBooking.id)
            .select()
            .single();

          if (updateError) throw updateError;
          
          setBooking(recentBooking);
          console.log("✅ Booking status updated to paid");

          if (!emailSent) {
            await sendEmail(recentBooking);
            setEmailSent(true);
          }
        } else {
          setBooking(bookingData);
          
          if (!emailSent) {
            await sendEmail(bookingData);
            setEmailSent(true);
          }
        }

      } catch (error: any) {
        console.error("Error retrieving booking:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, emailSent, sendEmail]);

  return { booking, isLoading, error };
};