import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📝 Received request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    const requestData = await req.json();
    console.log('📦 Request data:', {
      ...requestData,
      promoDetails: {
        promoCode: requestData.promoCode,
        originalPrice: requestData.price,
        finalPrice: requestData.finalPrice,
        discountAmount: requestData.discountAmount
      }
    });

    if (!requestData) {
      console.error('❌ No data provided in request');
      throw new Error('No data provided');
    }

    console.log('🔧 Processing checkout for user:', requestData.userId);

    // Si le prix final est 0 (réservation gratuite), on crée directement la réservation
    if (requestData.finalPrice === 0) {
      console.log('🆓 Processing free booking');
      
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase credentials');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Créer la réservation pour une réservation gratuite
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert([{
            user_id: requestData.userId,
            user_email: requestData.userEmail,
            user_name: requestData.userName,
            user_phone: requestData.userPhone,
            date: requestData.date,
            time_slot: requestData.timeSlot,
            duration: requestData.duration,
            group_size: requestData.groupSize,
            price: requestData.price,
            message: requestData.message,
            status: 'confirmed',
            payment_status: 'paid',
            is_test_booking: requestData.isTestMode,
            promo_code_id: requestData.promoCodeId,
          }])
          .select()
          .single();

        if (bookingError) {
          console.error('❌ Error creating free booking:', bookingError);
          throw bookingError;
        }

        console.log('✅ Free booking created:', booking);

        return new Response(
          JSON.stringify({ 
            url: `${req.headers.get('origin')}/success?booking_id=${booking.id}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('❌ Error processing free booking:', error);
        throw error;
      }
    }

    const stripeKey = requestData.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Missing Stripe API key');
      throw new Error(`${requestData.isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Format price description with promo code if applicable
    let priceDescription = `${requestData.groupSize} personnes - ${requestData.duration}h`;
    if (requestData.promoCode && requestData.discountAmount) {
      priceDescription += ` (-${Math.round(requestData.discountAmount)}% avec ${requestData.promoCode})`;
    }

    console.log('💳 Creating checkout session...', {
      originalPrice: requestData.price,
      finalPrice: requestData.finalPrice,
      promoCode: requestData.promoCode,
      discountAmount: requestData.discountAmount,
      description: priceDescription
    });

    // Créer d'abord la réservation
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: requestData.userId,
        user_email: requestData.userEmail,
        user_name: requestData.userName,
        user_phone: requestData.userPhone,
        date: requestData.date,
        time_slot: requestData.timeSlot,
        duration: requestData.duration,
        group_size: requestData.groupSize,
        price: requestData.price,
        message: requestData.message,
        status: 'pending',
        payment_status: 'unpaid',
        is_test_booking: requestData.isTestMode,
        promo_code_id: requestData.promoCodeId,
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      throw bookingError;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: requestData.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
              description: priceDescription,
              images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
            },
            unit_amount: Math.round(requestData.finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/error?error=payment_cancelled`,
      customer_email: requestData.userEmail,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire après 30 minutes
      metadata: {
        bookingId: booking.id,
        userId: requestData.userId,
        userEmail: requestData.userEmail,
        userName: requestData.userName,
        userPhone: requestData.userPhone,
        date: requestData.date,
        timeSlot: requestData.timeSlot,
        duration: requestData.duration,
        groupSize: requestData.groupSize,
        price: String(requestData.price),
        finalPrice: String(requestData.finalPrice),
        message: requestData.message || '',
        isTestMode: String(requestData.isTestMode),
        promoCodeId: requestData.promoCodeId || '',
        promoCode: requestData.promoCode || '',
        discountAmount: String(requestData.discountAmount || 0),
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: requestData.isTestMode ? 'TEST' : 'LIVE',
      url: session.url,
      priceDetails: {
        originalPrice: requestData.price,
        finalPrice: requestData.finalPrice,
        promoCode: requestData.promoCode,
        discountAmount: requestData.discountAmount
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in checkout process:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});