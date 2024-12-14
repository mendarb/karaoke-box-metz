import { Stripe } from 'https://esm.sh/stripe@12.0.0?target=deno';
import { CheckoutData } from './types.ts';
import { createLineItem, createMetadata } from './stripe-config.ts';

export const createCheckoutSession = async (
  stripe: Stripe,
  data: CheckoutData,
  origin: string
): Promise<Stripe.Checkout.Session> => {
  console.log('Creating checkout session with data:', {
    originalPrice: data.price,
    finalPrice: data.finalPrice || data.price,
    promoCodeId: data.promoCodeId
  });

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [createLineItem(data)],
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata: createMetadata(data),
  });
};