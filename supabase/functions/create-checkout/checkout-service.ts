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
    promoCode: data.promoCode,
    promoCodeId: data.promoCodeId,
    discountAmount: data.discountAmount,
    metadata: createMetadata(data),
    isTestMode: data.isTestMode
  });

  const metadata = createMetadata(data);
  const isFreeBooking = data.finalPrice === 0 || data.discountAmount === 100;

  // Format price description
  let priceDescription = `${data.groupSize} personnes - ${data.duration}h`;
  if (data.promoCode && data.discountAmount) {
    priceDescription += ` (-${Math.round(data.discountAmount)}% avec ${data.promoCode})`;
  }

  // Si le discount est de 100%, le prix final doit être 0
  const finalPrice = data.discountAmount === 100 ? 0 : data.finalPrice;
  const unitAmount = Math.round((finalPrice || 0) * 100);
  console.log('Final price calculation:', {
    originalPrice: data.price,
    discountAmount: data.discountAmount,
    finalPrice,
    unitAmount,
    isTestMode: data.isTestMode
  });

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
        unit_amount: unitAmount,
        product_data: {
          name: `${data.isTestMode ? '[TEST] ' : ''}Karaoké BOX - MB EI`,
          description: priceDescription,
          images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
        },
      },
      quantity: 1,
    }],
  };

  console.log('Final session config:', {
    mode: sessionConfig.mode,
    finalPrice,
    unitAmount,
    isFreeBooking,
    metadata: sessionConfig.metadata,
    isTestMode: data.isTestMode,
    promoDetails: {
      code: data.promoCode,
      id: data.promoCodeId,
      originalPrice: data.price,
      finalPrice,
      discountAmount: data.discountAmount,
      description: priceDescription
    }
  });

  try {
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Stripe session created:', {
      sessionId: session.id,
      isTestMode: data.isTestMode
    });
    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};