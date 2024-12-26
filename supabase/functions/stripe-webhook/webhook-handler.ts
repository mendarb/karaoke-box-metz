import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export async function handleWebhook(
  event: Stripe.Event, 
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('📦 Processing webhook event:', {
    type: event.type,
    id: event.id,
    livemode: event.livemode
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Checkout session completed:', {
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          metadata: session.metadata,
        });

        if (session.payment_status !== 'paid') {
          console.log('❌ Payment not completed yet:', session.payment_status);
          return { success: false, message: 'Payment not completed' };
        }

        // Update booking status
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .update({
            payment_intent_id: session.payment_intent as string,
            payment_status: 'paid',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata?.bookingId)
          .select()
          .single();

        if (bookingError) {
          console.error('❌ Error updating booking:', bookingError);
          throw bookingError;
        }

        console.log('✅ Booking updated successfully:', {
          bookingId: booking.id,
          status: booking.status,
          paymentStatus: booking.payment_status
        });

        // Send confirmation email
        try {
          const emailResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ booking })
            }
          );

          if (!emailResponse.ok) {
            throw new Error(await emailResponse.text());
          }

          console.log('✅ Confirmation email sent');
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          // Don't block the process if email fails
        }

        return { success: true, booking };
      }

      default:
        console.log(`🤔 Unhandled event type: ${event.type}`);
        return { success: true, message: `Unhandled event type: ${event.type}` };
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    throw error;
  }
}