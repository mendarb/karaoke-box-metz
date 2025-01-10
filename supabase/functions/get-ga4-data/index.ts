import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SignJWT } from "https://deno.land/x/jose@v4.9.1/index.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL')
    const privateKey = Deno.env.get('GA4_PRIVATE_KEY')
    const propertyId = Deno.env.get('GA4_PROPERTY_ID')

    if (!clientEmail || !privateKey || !propertyId) {
      console.error('Missing required environment variables:', {
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey,
        hasPropertyId: !!propertyId
      })
      throw new Error('Missing required GA4 credentials')
    }

    // Format private key correctly by:
    // 1. Replacing escaped newlines with actual newlines
    // 2. Removing any quotes
    // 3. Adding header and footer if not present
    let formattedKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .trim()

    // Add PEM header and footer if not present
    if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
      formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`
    }

    console.log('Creating JWT token...')

    // Create JWT token
    const now = Math.floor(Date.now() / 1000)
    const jwt = await new SignJWT({
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .setIssuer(clientEmail)
      .setSubject(clientEmail)
      .setAudience('https://oauth2.googleapis.com/token')
      .sign(await crypto.subtle.importKey(
        'pkcs8',
        new TextEncoder().encode(formattedKey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
      ))

    console.log('JWT token created, requesting access token...')

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error('Token exchange failed:', error)
      throw new Error(`Token exchange failed: ${error}`)
    }

    const { access_token } = await tokenResponse.json()
    console.log('Access token obtained, fetching GA4 data...')

    // Make request to GA4 API
    const ga4Response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'averageSessionDuration' }
          ]
        })
      }
    )

    if (!ga4Response.ok) {
      const error = await ga4Response.text()
      console.error('GA4 API error:', error)
      throw new Error(`GA4 API returned ${ga4Response.status}: ${error}`)
    }

    const data = await ga4Response.json()
    console.log('GA4 data received:', data)

    // Extract metrics from response
    const metrics = data.rows?.[0]?.metricValues || []
    const analyticsData = {
      activeUsers: parseInt(metrics[0]?.value || '0'),
      pageViews: parseInt(metrics[1]?.value || '0'),
      sessions: parseInt(metrics[2]?.value || '0'),
      averageSessionDuration: parseFloat(metrics[3]?.value || '0')
    }

    return new Response(
      JSON.stringify(analyticsData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in get-ga4-data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})