import { supabase } from "@/lib/supabase";

interface CreateCheckoutParams {
  bookingId: string;
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
  isTestMode: boolean;
  promoCodeId?: string;
  promoCode?: string;
}

export const createCheckoutSession = async (params: CreateCheckoutParams) => {
  console.log('💳 Creating checkout session with data:', {
    ...params,
    isTestMode: params.isTestMode
  });

  const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
    body: params
  });

  if (error) {
    console.error('❌ Error creating checkout:', error);
    throw error;
  }

  if (!checkoutData?.url) {
    console.error('❌ Payment URL not received');
    throw new Error('Payment URL not received');
  }

  console.log('✅ Checkout session created successfully:', {
    url: checkoutData.url,
    isTestMode: params.isTestMode
  });
  
  return checkoutData.url;
};