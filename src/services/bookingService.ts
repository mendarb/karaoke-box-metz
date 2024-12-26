import { supabase } from "@/lib/supabase";

export const createBooking = async (data: any, userId: string | null) => {
  console.log('📝 Creating new booking:', {
    userId,
    email: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.calculatedPrice,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount,
    isTestMode: data.isTestMode
  });

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: userId,
      user_email: data.email,
      user_name: data.fullName,
      user_phone: data.phone,
      date: data.date,
      time_slot: data.timeSlot,
      duration: data.duration,
      group_size: data.groupSize,
      price: data.calculatedPrice,
      message: data.message,
      status: 'pending',
      payment_status: 'awaiting_payment',
      is_test_booking: data.isTestMode,
      promo_code_id: data.promoCodeId,
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }

  console.log('✅ Booking created successfully:', {
    bookingId: booking.id,
    status: booking.status,
    paymentStatus: booking.payment_status,
    isTestMode: data.isTestMode,
    promoDetails: {
      promoCode: data.promoCode,
      originalPrice: data.calculatedPrice,
      finalPrice: data.finalPrice,
      discountAmount: data.discountAmount
    }
  });

  return booking;
};

export const generatePaymentLink = async (booking: any, data: any) => {
  console.log('💰 Generating payment link for booking:', booking.id, {
    originalPrice: data.calculatedPrice,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount,
    isTestMode: data.isTestMode
  });

  const checkoutUrl = await createCheckoutSession({
    bookingId: booking.id,
    userId: booking.user_id,
    userEmail: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.calculatedPrice,
    finalPrice: data.finalPrice || data.calculatedPrice,
    message: data.message,
    userName: data.fullName,
    userPhone: data.phone,
    isTestMode: data.isTestMode,
    promoCodeId: data.promoCodeId,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount,
  });

  console.log('✅ Payment link generated:', {
    url: checkoutUrl,
    isTestMode: data.isTestMode
  });
  return checkoutUrl;
};

export const fetchBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};