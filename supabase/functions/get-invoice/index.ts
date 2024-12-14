import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bookingId, paymentIntentId } = await req.json()
    console.log('Getting invoice for booking:', bookingId, 'with payment intent:', paymentIntentId)

    // Initialiser Stripe avec la clé secrète appropriée
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer les détails de la réservation
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError)
      throw new Error('Booking not found')
    }

    const stripeSecretKey = booking.is_test_booking 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY')

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Récupérer la facture à partir du payment_intent_id
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (!paymentIntent.invoice) {
      throw new Error('No invoice associated with this payment')
    }

    // Récupérer la facture
    const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string)
    
    if (!invoice.hosted_invoice_url) {
      throw new Error('No invoice URL available')
    }

    console.log('Invoice URL retrieved successfully')
    return new Response(
      JSON.stringify({ url: invoice.hosted_invoice_url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error retrieving invoice:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})