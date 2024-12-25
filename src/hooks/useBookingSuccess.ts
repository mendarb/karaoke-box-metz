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
  const [emailSent, setEmailSent] = useState(false);
  const { sendEmail } = useBookingEmail();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setIsLoading(false);
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

        if (bookingError) throw bookingError;

        if (!bookingData) {
          console.warn("⚠️ No booking found with session ID:", sessionId);
          throw new Error("Booking not found");
        }

        console.log("✅ Found booking:", bookingData);
        setBooking(bookingData);
        
        // Envoyer l'email une seule fois
        if (!emailSent && bookingData) {
          try {
            console.log("📧 Sending confirmation email for booking:", bookingData.id);
            await sendEmail(bookingData as Booking);
            setEmailSent(true);
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
            // Marquer l'email comme envoyé même en cas d'erreur pour éviter les tentatives en boucle
            setEmailSent(true);
          }
        }

      } catch (error: any) {
        console.error("❌ Error retrieving booking:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams, emailSent, sendEmail]);

  return { booking, isLoading, error };
};