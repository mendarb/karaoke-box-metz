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
    const requestBody = await req.json();
    console.log('📦 Received request data:', {
      email: requestBody.email,
      fullName: requestBody.fullName,
      date: requestBody.date,
      timeSlot: requestBody.timeSlot,
      duration: requestBody.duration,
      groupSize: requestBody.groupSize,
      price: requestBody.price,
      isTestMode: requestBody.isTestMode,
      userId: requestBody.userId,
    });

    if (!requestBody.userId) {
      console.error('❌ No user ID provided in request');
      throw new Error('User ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create booking with user_id
    console.log('📅 Creating booking with user_id:', requestBody.userId);
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: requestBody.userId,
        user_email: requestBody.email,
        user_name: requestBody.fullName,
        user_phone: requestBody.phone,
        date: requestBody.date,
        time_slot: requestBody.timeSlot,
        duration: requestBody.duration,
        group_size: requestBody.groupSize,
        price: requestBody.price,
        message: requestBody.message,
        status: 'pending',
        payment_status: 'awaiting_payment',
        is_test_booking: requestBody.isTestMode,
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('✅ Booking created:', booking);

    // Create Stripe checkout session
    const stripeKey = requestBody.isTestMode ? 
      Deno.env.get('STRIPE_TEST_SECRET_KEY')! : 
      Deno.env.get('STRIPE_SECRET_KEY')!;

    if (!stripeKey) {
      throw new Error(`${requestBody.isTestMode ? 'Test' : 'Live'} mode Stripe key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('💳 Creating Stripe session...');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(requestBody.price * 100),
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: `${requestBody.groupSize} personnes - ${requestBody.duration}h`,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: requestBody.email,
      metadata: {
        bookingId: booking.id,
        userId: requestBody.userId,
        userEmail: requestBody.email,
        userName: requestBody.fullName,
        userPhone: requestBody.phone,
        date: requestBody.date,
        timeSlot: requestBody.timeSlot,
        duration: requestBody.duration,
        groupSize: requestBody.groupSize,
        price: String(requestBody.price),
        message: requestBody.message || '',
        isTestMode: String(requestBody.isTestMode),
      },
    });

    console.log('✅ Stripe session created:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      bookingId: booking.id,
      userId: requestBody.userId,
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