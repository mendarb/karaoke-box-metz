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

  const finalPrice = data.finalPrice || data.price;

  // Configuration de base de la session
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata: createMetadata(data),
    payment_method_types: ['card'],
    locale: 'fr',
    invoice_creation: {
      enabled: true,
    },
  };

  // Si le prix est 0 (réservation gratuite)
  if (finalPrice === 0) {
    console.log('Creating free booking session');
    sessionConfig.submit_type = 'auto';
    sessionConfig.payment_method_types = [];
    sessionConfig.payment_intent_data = {
      metadata: createMetadata(data)
    };
  } else {
    // Sinon, créer un line item pour le paiement
    const lineItem = createLineItem(data);
    if (lineItem) {
      sessionConfig.line_items = [lineItem];
    }
  }

  console.log('Creating Stripe session with config:', sessionConfig);
  return await stripe.checkout.sessions.create(sessionConfig);
};