import { BookingFormData } from "@/components/booking/BookingForm";
import { supabase } from "@/lib/supabase";

export const createBooking = async (data: BookingFormData & { userId?: string }) => {
  try {
    const { data: response, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: data.userId,
          user_email: data.email,
          user_name: data.fullName,
          user_phone: data.phone,
          date: data.date,
          time_slot: data.timeSlot,
          duration: data.duration,
          group_size: data.groupSize,
          price: data.calculatedPrice,
          message: data.message,
          is_test_booking: data.isTestMode,
          promo_code_id: data.promoCodeId,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Pour l'instant, on retourne une URL factice
    return {
      success: true,
      bookingId: response.id,
      url: `/success?id=${response.id}`,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: 'Failed to create booking',
    };
  }
};