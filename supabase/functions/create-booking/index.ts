import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
    const origin = req.headers.get('origin') || '';
    const price = parseFloat(requestBody.price);

    if (!price || isNaN(price)) {
      throw new Error('Prix invalide');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profil utilisateur non trouvé');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('💰 Création de la session de paiement:', {
      email: profile.email,
      price,
      isTestMode: requestBody.isTestMode,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: `${requestBody.groupSize} personnes - ${requestBody.duration}h`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      customer_email: profile.email,
      payment_method_options: {
        klarna: {
          setup_future_usage: 'none'
        },
        paypal: {
          setup_future_usage: 'none'
        }
      },
      payment_method_types: ['card', 'paypal', 'klarna'],
      metadata: {
        userId: requestBody.userId,
        userEmail: requestBody.userEmail,
        userName: requestBody.userName,
        userPhone: requestBody.userPhone,
        date: requestBody.date,
        timeSlot: requestBody.timeSlot,
        duration: requestBody.duration,
        groupSize: requestBody.groupSize,
        price: requestBody.price,
        message: requestBody.message || '',
        promoCode: requestBody.promoCode || '',
        discountAmount: requestBody.discountAmount || '0',
        isTestMode: requestBody.isTestMode ? 'true' : 'false',
      },
      locale: 'fr',
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#FF5733',
          colorBackground: '#ffffff',
          colorText: '#1a1a1a',
          colorDanger: '#dc2626',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
        rules: {
          '.Input': {
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
          '.Input:focus': {
            border: '2px solid #FF5733',
            boxShadow: '0 0 0 1px #FF5733',
          },
          '.Button': {
            fontWeight: '600',
            textTransform: 'none',
            padding: '10px 16px',
          },
          '.Button:hover': {
            transform: 'translateY(-1px)',
          }
        }
      }
    });

    console.log('✅ Session de paiement créée:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans le processus de réservation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});