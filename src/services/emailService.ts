import { supabase } from "@/lib/supabase";
import { Booking } from "@/hooks/useBookings";

export const sendBookingEmail = async (booking: Booking) => {
  try {
    console.log('📧 Envoi d\'email pour la réservation:', {
      bookingId: booking.id,
      status: booking.status,
      userEmail: booking.user_email
    });

    const { error } = await supabase.functions.invoke('send-booking-email', {
      body: { 
        booking,
        type: 'confirmation'
      },
    });

    if (error) {
      console.error('❌ Erreur lors de l\'appel à la fonction send-booking-email:', error);
      throw error;
    }
    
    console.log('✅ Email envoyé avec succès pour la réservation:', booking.id);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};