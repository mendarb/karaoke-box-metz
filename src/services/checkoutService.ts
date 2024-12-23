import { supabase } from "@/lib/supabase";

interface CreateCheckoutSessionParams {
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
  bookingId?: string;
  discountAmount?: number;
}

export const createCheckoutSession = async ({
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
  bookingId,
  discountAmount,
}: CreateCheckoutSessionParams) => {
  console.log('Creating checkout session:', {
    originalPrice: price,
    finalPrice,
    promoCode,
    discountAmount,
    isTestMode
  });

  try {
    const response = await supabase.functions.invoke('create-checkout', {
      body: {
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
        bookingId,
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

    return url;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(error.message || 'Failed to create checkout session');
  }
};