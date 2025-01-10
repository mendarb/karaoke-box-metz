import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { BetaAnalyticsDataClient } from 'npm:@google-analytics/data';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupérer et vérifier les variables d'environnement
    const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL');
    const privateKey = Deno.env.get('GA4_PRIVATE_KEY');
    const propertyId = Deno.env.get('GA4_PROPERTY_ID');

    if (!clientEmail || !privateKey || !propertyId) {
      console.error('Missing required environment variables:', {
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey,
        hasPropertyId: !!propertyId
      });
      throw new Error('Missing required GA4 credentials');
    }

    // S'assurer que la clé privée est correctement formatée
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey
      },
    });

    console.log('Attempting to fetch GA4 data for property:', propertyId);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
      ],
    });

    if (!response.rows || response.rows.length === 0) {
      console.log('No data returned from GA4');
      return new Response(
        JSON.stringify({
          activeUsers: 0,
          pageViews: 0,
          sessions: 0,
          averageSessionDuration: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    const metrics = response.rows[0].metricValues;
    const data = {
      activeUsers: parseInt(metrics?.[0]?.value || '0'),
      pageViews: parseInt(metrics?.[1]?.value || '0'),
      sessions: parseInt(metrics?.[2]?.value || '0'),
      averageSessionDuration: parseFloat(metrics?.[3]?.value || '0'),
    };

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in get-ga4-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})