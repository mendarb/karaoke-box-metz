import { Stripe } from 'https://esm.sh/stripe@12.0.0?target=deno';
import { CheckoutData } from './types.ts';
import { createMetadata } from './stripe-config.ts';

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

  // Pour les réservations gratuites, on crée une session avec un montant de 0
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata,
    locale: 'fr',
    allow_promotion_codes: false,
    payment_method_types: isFreeBooking ? [] : ['card'],
    submit_type: 'auto-submit',
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(data.finalPrice * 100),
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

  // Pour les réservations gratuites, on confirme automatiquement la session
  const session = await stripe.checkout.sessions.create(sessionConfig);

  if (isFreeBooking) {
    console.log('Free booking - auto confirming session');
    // Simuler un webhook pour les réservations gratuites
    const response = await fetch(`${origin}/functions/v1/stripe-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'free-booking'
      },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: session.id,
            metadata: session.metadata,
            customer_email: session.customer_email,
            amount_total: 0,
            payment_status: 'paid'
          }
        }
      })
    });

    if (!response.ok) {
      console.error('Error auto confirming free booking:', await response.text());
    }
  }

  return session;
};