import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  console.log('📥 Webhook Stripe reçu');
  
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Secret webhook non configuré');
    }

    const eventData = JSON.parse(body);
    console.log('📊 Données de l\'événement:', {
      type: eventData.type,
      id: eventData.id,
      metadata: eventData.data?.object?.metadata,
      paymentIntent: eventData.data?.object?.payment_intent,
    });

    const isTestMode = eventData.data?.object?.metadata?.isTestMode === 'true';
    const stripeKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error(`Clé API Stripe ${isTestMode ? 'test' : 'live'} non configurée`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
      console.log('✅ Signature du webhook vérifiée');
    } catch (err) {
      console.error('❌ Échec de vérification de la signature du webhook:', err);
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
      console.log('💳 Traitement du paiement réussi:', {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        metadata: session.metadata,
      });

      try {
        // Rechercher d'abord par payment_intent_id
        console.log('🔍 Recherche de la réservation avec payment_intent_id:', session.payment_intent);
        let booking;
        let error;

        const { data: bookingByPaymentIntent, error: paymentIntentError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', session.payment_intent)
          .maybeSingle();

        if (bookingByPaymentIntent) {
          console.log('✅ Réservation trouvée par payment_intent_id:', bookingByPaymentIntent);
          booking = bookingByPaymentIntent;
        } else {
          console.log('⚠️ Réservation non trouvée par payment_intent_id, recherche par metadata...');
          
          // Essayer de trouver par l'ID dans les métadonnées
          const bookingId = session.metadata?.bookingId;
          if (!bookingId) {
            throw new Error('ID de réservation non trouvé dans les métadonnées');
          }

          const { data: bookingByMetadata, error: metadataError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .maybeSingle();

          if (metadataError || !bookingByMetadata) {
            console.error('❌ Réservation non trouvée:', metadataError || 'Aucune réservation correspondante');
            throw new Error('Réservation introuvable');
          }

          booking = bookingByMetadata;
          console.log('✅ Réservation trouvée par metadata:', booking);
        }

        // Mise à jour du statut de la réservation
        console.log('🔄 Mise à jour du statut de la réservation:', booking.id);
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour de la réservation:', updateError);
          throw updateError;
        }

        console.log('✅ Réservation mise à jour avec succès');

        // Envoi de l'email de confirmation
        try {
          console.log('📧 Envoi de l\'email de confirmation...');
          const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-booking-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ booking })
          });

          if (!emailResponse.ok) {
            throw new Error(`Erreur d'envoi d'email: ${await emailResponse.text()}`);
          }

          console.log('✅ Email de confirmation envoyé');
        } catch (emailError) {
          console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
          // Ne pas bloquer le processus si l'email échoue
        }

      } catch (error: any) {
        console.error('❌ Erreur dans le traitement de la session:', error);
        throw error;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('❌ Erreur dans le gestionnaire de webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});