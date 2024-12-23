import { stripe } from './stripe-config';
import { createClient } from '@supabase/supabase-js';
import { sendBookingConfirmationEmail } from './services/email-service';
import { updateBookingStatus } from './services/booking-service';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleStripeWebhook(event: any) {
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
          // Here you might want to refund the payment and notify the customer
          const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent as string,
          });
          console.log('Payment refunded:', refund);
          throw new Error('Time slot no longer available');
        }

        // Update booking status
        await updateBookingStatus(bookingId, 'confirmed', session.payment_intent as string);

        // Send confirmation email
        await sendBookingConfirmationEmail(booking);

        console.log('Booking confirmed and email sent successfully');
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;
        
        if (bookingId) {
          await updateBookingStatus(bookingId, 'cancelled');
          console.log('Booking cancelled due to expired session:', bookingId);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}