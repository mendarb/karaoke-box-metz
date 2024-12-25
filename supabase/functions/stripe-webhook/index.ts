import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format } from "https://esm.sh/date-fns@2.30.0";
import { fr } from "https://esm.sh/date-fns@2.30.0/locale";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  console.log('📥 Webhook request received');
  
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const eventData = JSON.parse(body);
    console.log('📊 Event data:', {
      type: eventData.type,
      id: eventData.id,
      metadata: eventData.data?.object?.metadata,
    });

    const isTestMode = eventData.data?.object?.metadata?.isTestMode === 'true';
    const stripeSecretKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error(`${isTestMode ? 'Test' : 'Live'} mode API key not configured`);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
      console.log('✅ Webhook signature verified');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: err.message }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Processing successful payment:', {
        sessionId: session.id,
        metadata: session.metadata,
      });

      // 1. Update booking status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_intent_id: session.payment_intent as string,
        })
        .eq('id', session.metadata?.bookingId)
        .select()
        .single();

      if (bookingError) {
        console.error('❌ Error updating booking:', bookingError);
        throw bookingError;
      }

      console.log('✅ Booking updated:', booking);

      // 2. Send confirmation email
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (!RESEND_API_KEY) {
        throw new Error('Resend API key not configured');
      }

      const bookingDate = new Date(booking.date);
      const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
      const startHour = parseInt(booking.time_slot);
      const endHour = startHour + parseInt(booking.duration);
      const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

      console.log('📧 Sending confirmation email...');
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Karaoké Box <reservations@karaoke-box-metz.fr>',
          to: [booking.user_email],
          subject: 'Votre réservation est confirmée ! - Karaoké Box Metz',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #7E3AED;">Votre réservation est confirmée !</h1>
              
              <p>Bonjour ${booking.user_name},</p>
              
              <p>Nous avons le plaisir de vous confirmer votre réservation au Karaoké Box :</p>
              
              <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Date :</strong> ${formattedDate}</p>
                <p><strong>⏰ Horaire :</strong> ${formatHour(startHour)} - ${formatHour(endHour)}</p>
                <p><strong>⌛️ Durée :</strong> ${booking.duration}h</p>
                <p><strong>👥 Nombre de participants :</strong> ${booking.group_size} personne(s)</p>
                <p><strong>💰 Prix :</strong> ${booking.price}€</p>
                ${booking.message ? `<p><strong>💬 Message :</strong> ${booking.message}</p>` : ''}
                ${booking.is_test_booking ? '<p style="color: #EAB308;"><strong>Ceci est une réservation de test</strong></p>' : ''}
              </div>
              
              <div style="background-color: #7E3AED; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: white; margin-top: 0;">📍 Lieu du rendez-vous</h2>
                <p style="margin-bottom: 0;">L'adresse exacte vous sera communiquée par SMS le jour de votre venue</p>
              </div>
              
              <div style="border-left: 4px solid #7E3AED; padding-left: 20px; margin: 20px 0;">
                <h2 style="color: #7E3AED; margin-top: 0;">ℹ️ Informations importantes</h2>
                <ul style="padding-left: 20px;">
                  <li>Merci d'arriver 15 minutes avant l'heure de votre réservation</li>
                  <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
                  <li>N'hésitez pas à préparer votre playlist à l'avance !</li>
                </ul>
              </div>
              
              <div style="margin-top: 40px;">
                <p><strong>Une question ?</strong></p>
                <p>📞 <a href="tel:+33612345678" style="color: #7E3AED;">06 12 34 56 78</a></p>
                <p>📧 <a href="mailto:contact@karaoke-box-metz.fr" style="color: #7E3AED;">contact@karaoke-box-metz.fr</a></p>
              </div>
              
              <p style="margin-top: 40px;">À très bientôt !</p>
              <p>L'équipe Karaoke Box Metz</p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('❌ Failed to send confirmation email:', errorText);
        throw new Error(`Failed to send confirmation email: ${errorText}`);
      }

      const emailResult = await emailResponse.json();
      console.log('✅ Confirmation email sent:', emailResult);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});