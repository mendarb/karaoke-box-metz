import { supabase } from "@/lib/supabase";

interface CreateBookingParams {
  userId: string;
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  message?: string;
  email: string;
  fullName: string;
  phone: string;
  isTestMode: boolean;
  promoCodeId?: string;
}

export const fetchBookings = async () => {
  console.log('📝 Fetching bookings');
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching bookings:', error);
    throw error;
  }

  console.log('✅ Bookings fetched successfully:', data);
  return data;
};

export const createBooking = async (params: CreateBookingParams) => {
  console.log('📝 Creating booking with data:', params);

  const bookingData = {
    user_id: params.userId,
    date: params.date,
    time_slot: params.timeSlot,
    duration: params.duration,
    group_size: params.groupSize,
    status: 'pending',
    price: params.price,
    message: params.message || null,
    user_email: params.email,
    user_name: params.fullName,
    user_phone: params.phone,
    payment_status: 'unpaid',
    is_test_booking: params.isTestMode,
    promo_code_id: params.promoCodeId,
  };

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }

  console.log('✅ Booking created successfully:', booking);
  return booking;
};