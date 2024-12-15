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
    promoCode: data.promoCode
  });

  const metadata = createMetadata(data);
  const isFreeBooking = data.finalPrice === 0;

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata,
    locale: 'fr',
    allow_promotion_codes: false,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: isFreeBooking ? 0 : Math.round(data.finalPrice * 100),
        product_data: {
          name: `${data.isTestMode ? '[TEST] ' : ''}Karaoké BOX - MB EI`,
          description: `${data.groupSize} personnes - ${data.duration}h${isFreeBooking ? ` - Gratuit avec le code ${data.promoCode}` : ''}`,
          images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
        },
      },
      quantity: 1,
    }],
  };

  console.log('Final session config:', {
    mode: sessionConfig.mode,
    finalPrice: data.finalPrice,
    isFreeBooking
  });

  return await stripe.checkout.sessions.create(sessionConfig);
};