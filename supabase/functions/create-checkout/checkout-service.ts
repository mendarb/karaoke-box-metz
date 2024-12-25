import { Stripe } from 'https://esm.sh/stripe@12.0.0?target=deno';
import { CheckoutData } from './types.ts';
import { createMetadata } from './stripe-config.ts';

export const createCheckoutSession = async (
  stripe: Stripe,
  data: CheckoutData,
  origin: string
): Promise<Stripe.Checkout.Session> => {
  console.log('💰 Création de la session de paiement:', {
    originalPrice: data.price,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode,
    promoCodeId: data.promoCodeId,
    discountAmount: data.discountAmount,
    metadata: createMetadata(data)
  });

  const metadata = createMetadata(data);
  
  // S'assurer d'utiliser le prix final exact
  const finalPrice = data.finalPrice !== undefined ? data.finalPrice : data.price;
  const unitAmount = Math.round(finalPrice * 100);

  console.log('💰 Détails du prix pour Stripe:', {
    originalPrice: data.price,
    finalPrice,
    unitAmount,
    promoDetails: {
      code: data.promoCode,
      discountAmount: data.discountAmount
    }
  });

  // Format de la description du prix avec code promo si applicable
  let priceDescription = `${data.groupSize} personnes - ${data.duration}h`;
  if (data.promoCode && data.discountAmount) {
    priceDescription += ` (-${Math.round(data.discountAmount)}% avec ${data.promoCode})`;
  }

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
          name: data.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
          description: priceDescription,
          images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
        },
      },
      quantity: 1,
    }],
  };

  try {
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('✅ Session Stripe créée:', {
      sessionId: session.id,
      finalPrice,
      unitAmount,
      promoDetails: {
        code: data.promoCode,
        discountAmount: data.discountAmount
      }
    });
    return session;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la session Stripe:', error);
    throw error;
  }
};