import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { BetaAnalyticsDataClient } from 'npm:@google-analytics/data';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: Deno.env.get('GA4_CLIENT_EMAIL'),
        private_key: Deno.env.get('GA4_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      },
    });

    const propertyId = Deno.env.get('GA4_PROPERTY_ID');
    
    if (!propertyId) {
      throw new Error('GA4_PROPERTY_ID is not set');
    }

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