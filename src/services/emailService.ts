import { supabase } from "@/lib/supabase";

export const sendBookingEmail = async (booking: any) => {
  try {
    console.log('📧 Envoi d\'email pour la réservation:', {
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
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }

    console.log('✅ Email envoyé avec succès:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    // On ne relance pas l'erreur pour ne pas bloquer le processus
    return { success: false, error };
  }
};