import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAccessToken } from "./auth.ts";
import { fetchGA4Data, processGA4Data } from "./ga4-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { startDate = '30daysAgo', endDate = 'today' } = await req.json();

    const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL');
    const privateKey = Deno.env.get('GA4_PRIVATE_KEY');
    const propertyId = Deno.env.get('GA4_PROPERTY_ID');

    if (!clientEmail || !privateKey || !propertyId) {
      console.error('Missing required environment variables');
      throw new Error('Missing required GA4 credentials');
    }

    console.log('Starting GA4 data fetch with:', {
      clientEmail,
      propertyId,
      startDate,
      endDate
    });

    const accessToken = await getAccessToken(clientEmail, privateKey);
    console.log('Access token obtained, fetching GA4 data...');

    const data = await fetchGA4Data(propertyId, accessToken, startDate, endDate);
    console.log('GA4 data received:', data);

    const processedData = processGA4Data(data);

    return new Response(
      JSON.stringify(processedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in get-ga4-data:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    );
  }
});