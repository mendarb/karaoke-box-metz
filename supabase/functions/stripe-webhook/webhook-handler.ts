import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export async function handleWebhook(event: any, stripe: Stripe | null, supabase: any) {
  try {
    console.log('📦 Processing webhook event:', {
      type: event.type,
      metadata: event.data?.object?.metadata,
      sessionId: event.data?.object?.id,
      paymentStatus: event.data?.object?.payment_status,
      paymentIntent: event.data?.object?.payment_intent
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💳 Checkout session completed:', {
          sessionId: session.id,
          metadata: session.metadata,
          customerEmail: session.customer_email,
          paymentStatus: session.payment_status,
          paymentIntentId: session.payment_intent,
          bookingId: session.metadata?.bookingId,
        });

        if (session.payment_status !== 'paid') {
          console.log('❌ Payment not completed yet:', session.payment_status);
          return { success: false, message: 'Payment not completed' };
        }

        // Mettre à jour la réservation avec le payment_intent_id et le statut
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .update({
            payment_intent_id: session.payment_intent,
            payment_status: 'paid',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.bookingId)
          .select()
          .single();

        if (bookingError) {
          console.error('❌ Error updating booking:', bookingError);
          throw bookingError;
        }

        if (!booking) {
          console.error('❌ No booking found with ID:', session.metadata.bookingId);
          return { success: false, message: 'Booking not found' };
        }

        console.log('✅ Booking updated successfully:', {
          bookingId: booking.id,
          status: booking.status,
          paymentStatus: booking.payment_status,
          paymentIntentId: booking.payment_intent_id
        });

        // Envoyer l'email de confirmation au client
        try {
          const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              booking: booking,
              type: 'confirmation'
            })
          });

          if (!emailResponse.ok) {
            throw new Error(`Failed to send confirmation email: ${await emailResponse.text()}`);
          }

          console.log('✅ Confirmation email sent successfully');
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log('⚠️ Checkout session expired:', {
          sessionId: session.id,
          bookingId: session.metadata?.bookingId
        });

        if (!session.metadata?.bookingId) {
          console.log('❌ No booking ID in metadata');
          return { success: false, message: 'No booking ID' };
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.bookingId);

        if (updateError) {
          console.error('❌ Error updating expired booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking marked as expired');
        break;
      }

      case 'payment_intent.payment_failed': {
        const session = event.data.object;
        console.log('❌ Payment failed:', {
          sessionId: session.id,
          bookingId: session.metadata?.bookingId
        });

        if (!session.metadata?.bookingId) {
          return { success: false, message: 'No booking ID' };
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.bookingId);

        if (updateError) {
          console.error('❌ Error updating failed booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking marked as failed');
        break;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    throw error;
  }
}