import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { handleCheckoutSession } from './handlers/checkout-session.ts';

export const handleWebhook = async (
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('🔵 Processing webhook event:', event.type);

  switch (event.type) {
    case 'checkout.session.completed':
      return await handleCheckoutSession(event.data.object as Stripe.Checkout.Session, supabase);
    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
      return { received: true };
  }
};