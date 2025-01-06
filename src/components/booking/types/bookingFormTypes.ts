export interface BookingFormData {
  email: string;
  fullName: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  duration: string;
  groupSize: string;
  message: string;
  promoCode?: string;
  promoCodeId?: string | null;
  finalPrice: number;
}