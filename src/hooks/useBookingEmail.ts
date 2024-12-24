import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";

export const useBookingEmail = () => {
  const sendEmail = async (booking: Booking) => {
    try {
      if (!booking || !booking.user_email || !booking.date || !booking.time_slot) {
        console.error('Missing required booking data for email');
        return;
      }

      console.log('📧 Sending email for booking:', {
        bookingId: booking.id,
        email: booking.user_email,
        date: booking.date,
        timeSlot: booking.time_slot
      });

      await sendBookingEmail(booking);
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error('❌ Email sending error:', error);
      throw error; // Propager l'erreur pour la gestion en amont
    }
  };

  return { sendEmail };
};