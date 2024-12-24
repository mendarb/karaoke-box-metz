import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";
import { toast } from "./use-toast";

export const useBookingEmail = () => {
  const sendEmail = async (booking: Booking) => {
    try {
      if (!booking || !booking.user_email || !booking.date || !booking.time_slot) {
        console.error('Missing required booking data for email');
        throw new Error('Données de réservation manquantes');
      }

      console.log('📧 Sending email for booking:', {
        bookingId: booking.id,
        email: booking.user_email,
        date: booking.date,
        timeSlot: booking.time_slot
      });

      await sendBookingEmail(booking);
      console.log('✅ Email sent successfully');
      
      toast({
        title: "Email envoyé",
        description: "Un email de confirmation vous a été envoyé",
      });
    } catch (error: any) {
      console.error('❌ Email sending error:', error);
      toast({
        title: "Erreur d'envoi d'email",
        description: "L'email n'a pas pu être envoyé, mais votre réservation est bien confirmée",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { sendEmail };
};