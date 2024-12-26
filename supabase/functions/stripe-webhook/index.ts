import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Stripe } from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    console.log("🎯 Webhook request received");

    // Get the raw body and signature
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ No Stripe signature found in headers");
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          status: 400 
        }
      );
    }

    // Parse the event to determine test/live mode
    const rawEvent = JSON.parse(rawBody);
    const isTestMode = !rawEvent.livemode;
    console.log("🔑 Mode:", isTestMode ? "TEST" : "LIVE");

    // Get the appropriate webhook secret based on mode
    const webhookSecret = isTestMode
      ? Deno.env.get("STRIPE_WEBHOOK_SECRET")
      : Deno.env.get("STRIPE_LIVE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error(`❌ ${isTestMode ? "Test" : "Live"} webhook secret not configured`);
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          status: 500 
        }
      );
    }

    // Initialize Stripe with the appropriate secret key
    const stripe = new Stripe(
      isTestMode
        ? Deno.env.get("STRIPE_TEST_SECRET_KEY") || ""
        : Deno.env.get("STRIPE_SECRET_KEY") || "",
      {
        apiVersion: "2023-10-16",
        httpClient: Stripe.createFetchHttpClient(),
      }
    );

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log("✅ Webhook signature verified, event:", event.type);
    } catch (err) {
      console.error("❌ Error verifying webhook signature:", err);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          status: 400 
        }
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("💳 Processing completed checkout session:", {
        sessionId: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status,
      });

      if (session.payment_status !== "paid") {
        console.log("❌ Payment not completed yet:", session.payment_status);
        return new Response(
          JSON.stringify({ received: true, status: "pending" }),
          {
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            status: 200,
          }
        );
      }

      try {
        // Update booking status
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          throw new Error("No booking ID in metadata");
        }

        const { data: booking, error: updateError } = await supabase
          .from("bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
            payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (updateError) {
          console.error("❌ Error updating booking:", updateError);
          throw updateError;
        }

        console.log("✅ Booking updated successfully:", {
          bookingId: booking.id,
          status: booking.status,
          paymentStatus: booking.payment_status,
        });

        // Send confirmation email
        try {
          const emailResponse = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-booking-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ booking }),
            }
          );

          if (!emailResponse.ok) {
            throw new Error(await emailResponse.text());
          }

          console.log("✅ Confirmation email sent");
        } catch (emailError) {
          console.error("❌ Error sending confirmation email:", emailError);
          // Don't block the process if email fails
        }

        return new Response(
          JSON.stringify({ received: true, booking }),
          {
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            status: 200,
          }
        );
      } catch (error) {
        console.error("❌ Error processing webhook:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            status: 500,
          }
        );
      }
    }

    // Return 200 for other events
    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Unhandled error in webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        status: 500,
      }
    );
  }
});