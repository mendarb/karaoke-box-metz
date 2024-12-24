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
          bookingId: session.metadata.bookingId
        });

        // First, update the booking with the payment_intent_id
        const { data: bookingUpdate, error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_intent_id: session.payment_intent
          })
          .eq('id', session.metadata.bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating booking with payment_intent:', updateError);
          throw updateError;
        }

        console.log('✅ Updated booking with payment_intent:', {
          bookingId: bookingUpdate.id,
          paymentIntentId: bookingUpdate.payment_intent_id
        });

        // Then update the status
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.bookingId)
          .select()
          .single();

        if (bookingError) {
          console.error('Error updating booking status:', bookingError);
          throw bookingError;
        }

        console.log('✅ Booking confirmed:', {
          bookingId: booking.id,
          status: booking.status,
          paymentStatus: booking.payment_status,
          paymentIntentId: booking.payment_intent_id
        });

        // Send confirmation email
        try {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              booking,
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

      default:
        console.log('Unhandled event type:', event.type);
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}