import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const sendConfirmationEmail = async (booking: any, supabase: ReturnType<typeof createClient>) => {
  try {
    console.log('📧 Sending confirmation email for booking:', booking.id);
    
    const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
      body: { booking }
    });

    if (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      throw emailError;
    }

    console.log('✅ Confirmation email sent successfully');
  } catch (error) {
    console.error('❌ Error in sendConfirmationEmail:', error);
    // On ne relance pas l'erreur pour ne pas bloquer le processus
    // mais on la log pour le debugging
  }
};