import { SupabaseClient } from "@supabase/supabase-js";

export const fetchBookings = async (
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
) => {
  console.log('Fetching bookings for period:', { startDate, endDate });
  
  const { data: confirmedBookings, error } = await supabase
    .from('bookings')
    .select('id, price, created_at, payment_status, status')
    .eq('payment_status', 'paid')
    .eq('status', 'confirmed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching confirmed bookings:', error);
    throw error;
  }

  console.log('Found confirmed bookings:', confirmedBookings);
  return confirmedBookings || [];
};

export const calculateBookingMetrics = (bookings: any[]) => {
  const bookingsCount = bookings.length;
  const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price), 0);

  console.log('Calculated metrics:', {
    bookingsCount,
    revenue,
    bookings
  });

  return {
    bookingsCount,
    revenue
  };
};