export interface BookingFormValues {
  email: string;
  fullName: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  groupSize: string;
  duration: string;
  message: string;
  isTestMode?: boolean;
  promoCode?: string;
  promoCodeId?: string;
  finalPrice?: number;
  acceptTerms?: boolean;
  location?: string; // Ajout du champ location
}