import { SupabaseClient } from "@supabase/supabase-js";

export const fetchBookings = async (
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
) => {
  const { data: confirmedBookings } = await supabase
    .from('bookings')
    .select('id, price')
    .eq('payment_status', 'paid')
    .eq('status', 'confirmed')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  return confirmedBookings || [];
};

export const calculateBookingMetrics = (bookings: any[]) => {
  const bookingsCount = bookings.length;
  const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price), 0);

  return {
    bookingsCount,
    revenue
  };
};