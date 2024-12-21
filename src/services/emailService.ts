import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const sendBookingEmail = async (booking: Booking) => {
  try {
    console.log('📧 Sending booking email for:', booking);
    const { error } = await supabase.functions.invoke('send-booking-email', {
      body: { 
        booking,
        type: booking.status === 'confirmed' ? 'confirmation' : 'pending'
      },
    });

    if (error) {
      console.error('❌ Error invoking send-booking-email function:', error);
      throw error;
    }
    
    console.log('✅ Email sent successfully for booking:', booking.id);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};