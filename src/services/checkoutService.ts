import { stripe } from "@/lib/stripe";

interface CreateCheckoutSessionParams {
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
  isTestMode?: boolean;
}

export const createCheckoutSession = async ({
  bookingId,
  userEmail,
  date,
  timeSlot,
  duration,
  groupSize,
  finalPrice,
  userName,
  isTestMode = false,
}: CreateCheckoutSessionParams) => {
  console.log('Creating checkout session for booking:', bookingId);

  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        userEmail,
        date,
        timeSlot,
        duration,
        groupSize,
        price: finalPrice,
        userName,
        isTestMode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No checkout URL returned');
    }

    return url;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(error.message || 'Failed to create checkout session');
  }
};