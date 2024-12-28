const GA_MEASUREMENT_ID = Deno.env.get('GA_MEASUREMENT_ID');

export const trackEvent = async (name: string, params: any) => {
  if (!GA_MEASUREMENT_ID) return;

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${Deno.env.get('GA_API_SECRET')}`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: 'server',
        events: [{
          name,
          params
        }]
      })
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};