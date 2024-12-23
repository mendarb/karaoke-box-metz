import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handleWebhook(event: any, stripe: Stripe | null, supabase: any) {
  try {
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session);

        // Update booking status
        const bookingId = session.metadata.bookingId;
        if (!bookingId) {
          throw new Error('No booking ID found in session metadata');
        }

        // Check if booking exists and isn't already confirmed
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (bookingError || !booking) {
          console.error('Error fetching booking:', bookingError);
          throw new Error('Booking not found');
        }

        if (booking.status === 'confirmed') {
          console.log('Booking already confirmed, skipping');
          return;
        }

        // Check for overlapping bookings
        const { data: overlappingBookings, error: overlapError } = await supabase
          .from('bookings')
          .select('*')
          .eq('date', booking.date)
          .eq('time_slot', booking.time_slot)
          .neq('id', bookingId)
          .eq('status', 'confirmed')
          .is('deleted_at', null);

        if (overlapError) {
          console.error('Error checking overlapping bookings:', overlapError);
          throw new Error('Error checking booking availability');
        }

        if (overlappingBookings && overlappingBookings.length > 0) {
          console.error('Overlapping booking found:', overlappingBookings);
          if (stripe && session.payment_intent) {
            const refund = await stripe.refunds.create({
              payment_intent: session.payment_intent as string,
            });
            console.log('Payment refunded:', refund);
          }
          throw new Error('Time slot no longer available');
        }

        // Update booking status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId);

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw updateError;
        }

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
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't throw here, we don't want to fail the webhook just because email failed
        }

        console.log('Booking confirmed and email sent successfully');
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;
        
        if (bookingId) {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

          if (updateError) {
            console.error('Error updating expired booking:', updateError);
            throw updateError;
          }
          
          console.log('Booking cancelled due to expired session:', bookingId);
        }
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