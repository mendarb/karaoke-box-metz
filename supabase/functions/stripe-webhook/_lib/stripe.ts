import Stripe from 'stripe';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripeTestSecretKey = Deno.env.get('STRIPE_TEST_SECRET_KEY') || '';

export const getStripe = (isTestMode: boolean) => {
  const secretKey = isTestMode ? stripeTestSecretKey : stripeSecretKey;
  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
};

export const stripe = getStripe(false); // Production par défaut