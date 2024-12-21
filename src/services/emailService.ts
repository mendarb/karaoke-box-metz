import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const sendBookingEmail = async (booking: Booking, type: 'confirmation' | 'pending' = 'confirmation') => {
  try {
    console.log('Sending booking email:', { booking, type });
    
    const { error } = await supabase.functions.invoke('send-booking-email', {
      body: { 
        booking,
        type
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in sendBookingEmail:', error);
    throw error;
  }
};