import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    console.log('Getting invoice for booking:', { bookingId, paymentIntentId });

    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Récupérer le payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Payment intent retrieved:', paymentIntent.id);

    if (!paymentIntent.invoice) {
      // Créer une facture si elle n'existe pas
      console.log('Creating invoice for payment intent:', paymentIntent.id);
      const invoice = await stripe.invoices.create({
        payment_intent: paymentIntent.id,
        customer: paymentIntent.customer as string,
        auto_advance: true,
      });

      // Finaliser la facture
      await stripe.invoices.finalizeInvoice(invoice.id);
      console.log('Invoice finalized:', invoice.id);

      // Récupérer l'URL de la facture
      const invoiceData = await stripe.invoices.retrieve(invoice.id);
      console.log('Invoice URL:', invoiceData.invoice_pdf);

      return new Response(
        JSON.stringify({ url: invoiceData.invoice_pdf }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Si la facture existe déjà, la récupérer
    const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
    console.log('Existing invoice retrieved:', invoice.id);

    return new Response(
      JSON.stringify({ url: invoice.invoice_pdf }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error getting invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});