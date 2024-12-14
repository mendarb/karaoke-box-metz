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
    console.log('Payment intent retrieved:', {
      id: paymentIntent.id,
      invoice: paymentIntent.invoice,
      customer: paymentIntent.customer
    });

    // Si une facture existe déjà, la récupérer
    if (paymentIntent.invoice) {
      const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
      console.log('Existing invoice retrieved:', invoice.id);

      return new Response(
        JSON.stringify({ url: invoice.invoice_pdf }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Si pas de facture, en créer une nouvelle
    console.log('Creating new invoice for payment intent:', paymentIntent.id);
    const invoice = await stripe.invoices.create({
      customer: paymentIntent.customer as string,
      auto_advance: true,
      collection_method: 'charge_automatically',
      metadata: paymentIntent.metadata,
    });

    // Ajouter le payment intent à la facture
    await stripe.invoiceItems.create({
      customer: paymentIntent.customer as string,
      invoice: invoice.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      description: `Réservation Karaoké BOX - ${paymentIntent.metadata?.date || 'N/A'}`,
    });

    // Finaliser et payer la facture
    await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.pay(invoice.id);

    // Récupérer la facture mise à jour
    const finalInvoice = await stripe.invoices.retrieve(invoice.id);
    console.log('Invoice created and finalized:', {
      id: finalInvoice.id,
      status: finalInvoice.status,
      pdfUrl: finalInvoice.invoice_pdf
    });

    return new Response(
      JSON.stringify({ url: finalInvoice.invoice_pdf }),
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