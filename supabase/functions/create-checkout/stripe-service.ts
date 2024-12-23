import Stripe from 'https://esm.sh/stripe@14.21.0';
import { validatePrice } from './price-validation.ts';

export const createStripeSession = async (
  stripe: Stripe,
  data: any,
  booking: any,
  origin: string
) => {
  console.log('💳 Création de la session de paiement:', {
    bookingId: booking.id,
    originalPrice: data.price,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode
  });

  // Validation du prix minimum
  const unitAmount = validatePrice(data.finalPrice);

  // Format price description with promo code if applicable
  let priceDescription = `${data.groupSize} personnes - ${data.duration}h`;
  if (data.promoCode && data.discountAmount) {
    priceDescription += ` (-${Math.round(data.discountAmount)}% avec ${data.promoCode})`;
  }

  return stripe.checkout.sessions.create({
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
    cancel_url: `${origin}/error?error=payment_cancelled`,
    customer_email: data.userEmail,
    expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    metadata: {
      bookingId: booking.id,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      userPhone: data.userPhone,
      date: data.date,
      timeSlot: data.timeSlot,
      duration: data.duration,
      groupSize: data.groupSize,
      price: String(data.price),
      finalPrice: String(data.finalPrice),
      message: data.message || '',
      isTestMode: String(data.isTestMode),
      promoCodeId: data.promoCodeId || '',
      promoCode: data.promoCode || '',
      discountAmount: String(data.discountAmount || 0),
    }
  });
};