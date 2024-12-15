export interface CheckoutData {
  price: number;
  finalPrice?: number;
  groupSize: string;
  duration: string;
  date: string;
  timeSlot: string;
  message?: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  isTestMode: boolean;
  userId: string;
  promoCodeId?: string;
  promoCode?: string;
}

export interface StripeMetadata {
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  message: string;
  userName: string;
  userPhone: string;
  isTestMode: string;
  userId: string;
  promoCodeId?: string;
  promoCode?: string;
  originalPrice: string;
  finalPrice: string;
}