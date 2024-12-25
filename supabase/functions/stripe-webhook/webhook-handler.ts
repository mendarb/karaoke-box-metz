import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export async function handleWebhook(event: any, stripe: Stripe | null, supabase: any) {
  try {
    console.log('Processing webhook event:', {
      type: event.type,
      metadata: event.data?.object?.metadata,
      sessionId: event.data?.object?.id,
      paymentStatus: event.data?.object?.payment_status,
      paymentIntent: event.data?.object?.payment_intent
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', {
          sessionId: session.id,
          metadata: session.metadata,
          customerEmail: session.customer_email,
          paymentStatus: session.payment_status,
          paymentIntentId: session.payment_intent,
          bookingId: session.metadata.bookingId,
        });

        // Vérifier que le paiement est bien effectué
        if (session.payment_status !== 'paid') {
          console.log('Payment not completed yet:', session.payment_status);
          return { success: false, message: 'Payment not completed' };
        }

        // Vérifier si la réservation n'a pas déjà été mise à jour
        const { data: existingBooking } = await supabase
          .from('bookings')
          .select('status, payment_status')
          .eq('id', session.metadata.bookingId)
          .maybeSingle();

        if (existingBooking?.payment_status === 'paid') {
          console.log('Booking already marked as paid:', session.metadata.bookingId);
          return { success: true, message: 'Booking already processed' };
        }

        // Mettre à jour la réservation
        const { data: bookingUpdate, error: updateError } = await supabase
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

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking updated:', {
          bookingId: bookingUpdate.id,
          status: bookingUpdate.status,
          paymentStatus: bookingUpdate.payment_status,
          paymentIntentId: bookingUpdate.payment_intent_id
        });

        // Envoyer l'email de confirmation
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes

          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              booking: bookingUpdate,
              type: 'confirmation'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to send confirmation email');
          }
          
          console.log('✅ Confirmation email sent successfully');
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log('Checkout session expired:', {
          sessionId: session.id,
          metadata: session.metadata,
          bookingId: session.metadata.bookingId
        });

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.bookingId);

        if (updateError) {
          console.error('Error updating expired booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking marked as expired');
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', {
          paymentIntentId: paymentIntent.id,
          metadata: paymentIntent.metadata,
          bookingId: paymentIntent.metadata.bookingId
        });

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id);

        if (updateError) {
          console.error('Error updating failed booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking marked as failed');
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}