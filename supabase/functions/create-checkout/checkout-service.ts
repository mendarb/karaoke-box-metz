import { Stripe } from 'https://esm.sh/stripe@12.0.0?target=deno';
import { CheckoutData } from './types.ts';
import { createLineItem, createMetadata } from './stripe-config.ts';

export const createCheckoutSession = async (
  stripe: Stripe,
  data: CheckoutData,
  origin: string
): Promise<Stripe.Checkout.Session> => {
  console.log('Création de la session de paiement avec les données:', {
    originalPrice: data.price,
    finalPrice: data.finalPrice,
    promoCodeId: data.promoCodeId,
    promoCode: data.promoCode
  });

  const metadata = createMetadata(data);
  const isFreeBooking = data.finalPrice === 0;

  console.log('Mode de la session:', isFreeBooking ? 'setup' : 'payment');

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: isFreeBooking ? 'setup' : 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata,
    locale: 'fr',
    allow_promotion_codes: false,
  };

  if (!isFreeBooking) {
    console.log('Configuration de la session payante');
    sessionConfig.payment_method_types = ['card'];
    const lineItem = createLineItem(data);
    if (lineItem) {
      sessionConfig.line_items = [lineItem];
    }
  } else {
    console.log('Configuration de la session gratuite');
    sessionConfig.payment_method_types = ['card'];
    sessionConfig.submit_type = 'auto';
    sessionConfig.line_items = [{
      price_data: {
        currency: 'eur',
        unit_amount: 0,
        product_data: {
          name: `${data.isTestMode ? '[TEST] ' : ''}Karaoké BOX - MB EI`,
          description: `${data.groupSize} personnes - ${data.duration}h - Gratuit avec le code ${data.promoCode}`,
          images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
        },
      },
      quantity: 1,
    }];
  }

  console.log('Configuration finale de la session:', {
    mode: sessionConfig.mode,
    lineItems: sessionConfig.line_items,
    finalPrice: data.finalPrice,
    isFreeBooking
  });

  return await stripe.checkout.sessions.create(sessionConfig);
};