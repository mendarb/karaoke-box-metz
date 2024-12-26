import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, phone, date, timeSlot, duration, groupSize, price, message, isTestMode, userId } = await req.json();

    console.log('📝 Starting unified booking process:', {
      email,
      fullName,
      date,
      timeSlot,
      duration,
      groupSize,
      price,
      isTestMode,
      userId // Log l'ID utilisateur reçu
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Create booking with user_id
    console.log('📅 Creating booking with user_id:', userId);
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: userId, // Utiliser l'ID utilisateur reçu
        user_email: email,
        user_name: fullName,
        user_phone: phone,
        date,
        time_slot: timeSlot,
        duration,
        group_size: groupSize,
        price,
        message,
        status: 'pending',
        payment_status: 'awaiting_payment',
        is_test_booking: isTestMode,
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('✅ Booking created:', booking.id);

    // 3. Create Stripe checkout session
    const stripe = new Stripe(isTestMode ? 
      Deno.env.get('STRIPE_TEST_SECRET_KEY')! : 
      Deno.env.get('STRIPE_SECRET_KEY')!, 
      { apiVersion: '2023-10-16' }
    );

    console.log('💳 Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: `${groupSize} personnes - ${duration}h`,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: email,
      metadata: {
        bookingId: booking.id,
        userId,
        userEmail: email,
        userName: fullName,
        userPhone: phone,
        date,
        timeSlot,
        duration,
        groupSize,
        price: price.toString(),
        message: message || '',
        isTestMode: isTestMode ? 'true' : 'false',
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      bookingId: booking.id,
      metadata: session.metadata
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        bookingId: booking.id,
        checkoutUrl: session.url 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in unified booking process:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});