import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/services/checkoutService";

export const createBooking = async (data: any, userId: string | null) => {
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
      payment_status: 'unpaid',
      is_test_booking: false,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return booking;
};

export const generatePaymentLink = async (booking: any, data: any) => {
  return await createCheckoutSession({
    bookingId: booking.id,
    userEmail: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.calculatedPrice,
    finalPrice: data.calculatedPrice,
    message: data.message,
    userName: data.fullName,
    userPhone: data.phone,
    isTestMode: false,
  });
};