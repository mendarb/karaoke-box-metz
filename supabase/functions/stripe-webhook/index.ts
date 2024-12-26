import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@14.21.0';

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

    // Récupérer la signature du webhook depuis les en-têtes
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('❌ Pas de signature Stripe dans les en-têtes');
      throw new Error('No stripe signature found in headers');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('❌ Secret webhook non configuré');
      throw new Error('Webhook secret not configured');
    }

    // Récupérer le corps de la requête en tant que texte
    const body = await req.text();
    console.log('📦 Corps de la requête reçu:', body.substring(0, 100) + '...');

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    });

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Signature du webhook vérifiée');
      console.log('📦 Type d\'événement reçu:', event.type);
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
        
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', session.payment_intent)
          .single();

        if (bookingError) {
          console.error('❌ Erreur lors de la recherche de la réservation:', bookingError);
          throw bookingError;
        }

        if (!booking) {
          console.error('❌ Aucune réservation trouvée avec le payment_intent_id:', session.payment_intent);
          throw new Error('Réservation introuvable');
        }

        console.log('✅ Réservation trouvée:', booking);

        // Mise à jour du statut de la réservation
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
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
            body: JSON.stringify({ 
              booking,
              type: 'confirmation'
            })
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