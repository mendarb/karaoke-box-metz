export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  status: BookingStatus;
  price: number;
  message: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
  payment_status: string;
  created_at: string;
  updated_at: string | null;
}