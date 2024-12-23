import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function updateBookingStatus(
  bookingId: string, 
  status: 'confirmed' | 'cancelled', 
  paymentIntentId?: string
) {
  console.log('Updating booking status:', { bookingId, status, paymentIntentId });

  const updateData: any = {
    status,
    payment_status: status === 'confirmed' ? 'paid' : 'cancelled',
    updated_at: new Date().toISOString(),
  };

  if (paymentIntentId) {
    updateData.payment_intent_id = paymentIntentId;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }

  console.log('Booking status updated successfully:', data);
  return data;
}