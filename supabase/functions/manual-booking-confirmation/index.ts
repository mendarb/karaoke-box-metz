import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user email from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, first_name, last_name, phone')
      .eq('id', 'dbcf9ebf-c4ac-4996-a566-92957d6884b6')
      .single();

    if (profileError) {
      throw profileError;
    }

    console.log('📧 Profile récupéré:', profile);

    const userName = profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : 'Client';

    // Insert the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        id: "79772514-2c10-4399-aefb-34d6d77e97cb",
        user_id: "dbcf9ebf-c4ac-4996-a566-92957d6884b6",
        user_email: profile.email,
        user_name: userName,
        user_phone: profile.phone || '',
        date: "2025-01-25",
        time_slot: "21:00",
        duration: "2",
        group_size: "4",
        price: 79.8,
        status: "confirmed",
        payment_status: "paid",
        payment_intent_id: "pi_3QeiuX08cLtke4H41nd2sLXF",
        cabin: "metz",
        is_test_booking: false
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Erreur lors de la création de la réservation:', bookingError);
      throw bookingError;
    }

    console.log('✅ Réservation créée:', {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status,
      userEmail: booking.user_email
    });

    // Send confirmation email
    const emailResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({ booking }),
      }
    );

    if (!emailResponse.ok) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', await emailResponse.text());
      throw new Error(await emailResponse.text());
    }

    console.log('✅ Email de confirmation envoyé');

    return new Response(JSON.stringify({ success: true, booking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});