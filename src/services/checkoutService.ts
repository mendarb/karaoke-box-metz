import { supabase } from "@/lib/supabase";

interface CreateCheckoutSessionParams {
  bookingId: string;
  userId: string;
  userEmail: string;
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  finalPrice: number;
  message?: string;
  userName: string;
  userPhone: string;
  isTestMode?: boolean;
  promoCodeId?: string;
  promoCode?: string;
  discountAmount?: number;
}

export const createCheckoutSession = async ({
  bookingId,
  userId,
  userEmail,
  date,
  timeSlot,
  duration,
  groupSize,
  price,
  finalPrice,
  userName,
  userPhone,
  isTestMode = false,
  promoCodeId,
  promoCode,
  message,
  discountAmount,
}: CreateCheckoutSessionParams) => {
  console.log('Creating checkout session:', {
    bookingId,
    originalPrice: price,
    finalPrice,
    promoCode,
    discountAmount,
    isTestMode
  });

  try {
    const response = await supabase.functions.invoke('create-checkout', {
      body: {
        bookingId,
        userId,
        userEmail,
        date,
        timeSlot,
        duration,
        groupSize,
        price,
        finalPrice,
        userName,
        userPhone,
        isTestMode,
        promoCodeId,
        promoCode,
        message,
        discountAmount,
      },
    });

    if (response.error) {
      console.error('Error creating checkout session:', response.error);
      throw new Error(response.error.message || 'Failed to create checkout session');
    }

    const { url } = response.data;
    
    if (!url) {
      throw new Error('No checkout URL returned');
    }

    console.log('✅ Checkout URL generated:', {
      url,
      bookingId,
      isTestMode
    });

    return url;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(error.message || 'Failed to create checkout session');
  }
};