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
    finalPrice: data.finalPrice,
    promoCodeId: data.promoCodeId,
    promoCode: data.promoCode
  });

  const metadata = createMetadata(data);

  // Configuration de base de la session
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: data.finalPrice === 0 ? 'setup' : 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata: metadata,
    locale: 'fr',
    invoice_creation: {
      enabled: true,
    },
    payment_intent_data: {
      metadata: metadata,
    },
    allow_promotion_codes: false, // Désactiver les codes promo Stripe
  };

  // Si le prix est 0 (réservation gratuite)
  if (data.finalPrice === 0) {
    console.log('Creating free booking session');
    sessionConfig.submit_type = 'auto';
  } else {
    // Sinon, créer un line item pour le paiement
    console.log('Creating paid booking session');
    sessionConfig.payment_method_types = ['card'];
    const lineItem = createLineItem(data);
    if (lineItem) {
      sessionConfig.line_items = [lineItem];
    }
  }

  console.log('Creating Stripe session with config:', {
    ...sessionConfig,
    mode: sessionConfig.mode,
    lineItems: sessionConfig.line_items,
    finalPrice: data.finalPrice
  });
  
  return await stripe.checkout.sessions.create(sessionConfig);
};