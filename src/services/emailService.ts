import { supabase } from "@/lib/supabase";

export const sendBookingEmail = async (booking: any) => {
  try {
    console.log('📧 Sending booking email:', {
      bookingId: booking.id,
      status: booking.status,
      userEmail: booking.user_email,
      isTestBooking: booking.is_test_booking,
      paymentStatus: booking.payment_status
    });

    const { data, error } = await supabase.functions.invoke('send-booking-email', {
      body: { 
        booking,
        type: 'confirmation'
      }
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }

    console.log('✅ Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Error in sendBookingEmail:', error);
    throw error;
  }
};