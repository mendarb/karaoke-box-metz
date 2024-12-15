import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { bookingId, paymentIntentId } = await req.json();
    console.log('Getting invoice for:', { bookingId, paymentIntentId });

    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Récupérer la facture associée au paiement
    const invoices = await stripe.invoices.list({
      payment_intent: paymentIntentId,
    });

    if (!invoices.data.length) {
      throw new Error('No invoice found for this payment');
    }

    const invoice = invoices.data[0];
    console.log('Invoice found:', invoice.id);

    // Générer l'URL de téléchargement de la facture
    const invoicePdf = await stripe.invoices.retrieve(invoice.id, {
      expand: ['invoice_pdf'],
    });

    if (!invoicePdf.invoice_pdf) {
      throw new Error('Invoice PDF not available');
    }

    return new Response(
      JSON.stringify({ url: invoicePdf.invoice_pdf }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error getting invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});