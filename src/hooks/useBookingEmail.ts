import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";

export const useBookingEmail = () => {
  const sendEmail = async (booking: Booking) => {
    try {
      await sendBookingEmail(booking);
    } catch (error) {
      console.error('Email sending error:', error);
      // Continue even if email fails
    }
  };

  return { sendEmail };
};