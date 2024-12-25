import Stripe from 'https://esm.sh/stripe@14.21.0';

export const createStripeSession = async (
  stripe: Stripe,
  data: any,
  origin: string
) => {
  console.log('💳 Creating payment session:', {
    bookingId: data.bookingId,
    originalPrice: data.price,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount
  });

  // Utiliser exactement le prix final fourni
  const finalPrice = data.finalPrice || data.price;
  const unitAmount = Math.round(finalPrice * 100);

  console.log('💰 Prix détaillés:', {
    originalPrice: data.price,
    finalPrice,
    unitAmount,
    promoDetails: {
      code: data.promoCode,
      discountAmount: data.discountAmount
    }
  });

  // Format price description with promo code if applicable
  let priceDescription = `${data.groupSize} personnes - ${data.duration}h`;
  if (data.promoCode && data.discountAmount) {
    priceDescription += ` (-${Math.round(data.discountAmount)}% avec ${data.promoCode})`;
  }

  const metadata = {
    bookingId: data.bookingId,
    userId: data.userId || '',
    userEmail: data.userEmail,
    userName: data.userName,
    userPhone: data.userPhone,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: String(data.price),
    finalPrice: String(finalPrice),
    message: data.message || '',
    isTestMode: String(data.isTestMode),
    promoCodeId: data.promoCodeId || '',
    promoCode: data.promoCode || '',
    discountAmount: String(data.discountAmount || 0),
  };

  console.log('📦 Creating Stripe session with metadata:', metadata);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: data.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: priceDescription,
            images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    customer_email: data.userEmail,
    metadata,
    expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
  });

  console.log('✅ Stripe session created:', {
    sessionId: session.id,
    bookingId: data.bookingId,
    metadata: session.metadata,
    finalPrice,
    unitAmount,
    promoDetails: {
      code: data.promoCode,
      discountAmount: data.discountAmount
    }
  });

  return session;
};