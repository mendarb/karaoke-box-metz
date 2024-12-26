import { Stripe } from "https://esm.sh/stripe@14.21.0";

export const verifyStripeWebhook = async (
  signature: string | null,
  rawBody: string,
  isTestMode: boolean
): Promise<Stripe.Event> => {
  if (!signature) {
    throw new Error("No Stripe signature found in headers");
  }

  const webhookSecret = isTestMode
    ? Deno.env.get("STRIPE_WEBHOOK_SECRET")
    : Deno.env.get("STRIPE_LIVE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    throw new Error(`${isTestMode ? "Test" : "Live"} webhook secret not configured`);
  }

  const stripe = new Stripe(
    isTestMode
      ? Deno.env.get("STRIPE_TEST_SECRET_KEY") || ""
      : Deno.env.get("STRIPE_SECRET_KEY") || "",
    {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    }
  );

  try {
    return await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Error verifying webhook signature:", err);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
};