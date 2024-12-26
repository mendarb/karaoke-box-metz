import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { verifyStripeWebhook } from "./webhook-verification.ts";
import { handleCheckoutSession } from "./handlers/checkout-session.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const createResponse = (body: any, status: number) => {
  return new Response(JSON.stringify(body), {
    headers: { 
      ...corsHeaders, 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
    },
    status,
  });
};

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    console.log("🎯 Webhook request received");

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const rawEvent = JSON.parse(rawBody);
    const isTestMode = !rawEvent.livemode;

    try {
      const event = await verifyStripeWebhook(signature, rawBody, isTestMode);
      console.log("✅ Webhook signature verified, event:", event.type);

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const result = await handleCheckoutSession(session, supabase);
        return createResponse(result, 200);
      }

      return createResponse({ received: true }, 200);
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      return createResponse({ error: error.message }, 400);
    }
  } catch (error) {
    console.error("❌ Unhandled error in webhook:", error);
    return createResponse({ error: error.message }, 500);
  }
});