import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { importPKCS8, SignJWT } from "https://deno.land/x/jose@v4.9.1/index.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
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

    // Format private key correctly
    const formattedKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .trim()

    console.log('Attempting to create JWT...')

    // Create JWT token using jose
    const privateKeyObject = await importPKCS8(formattedKey, 'RS256')
    const now = Math.floor(Date.now() / 1000)
    
    const jwt = await new SignJWT({
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .setIssuer(clientEmail)
      .setSubject(clientEmail)
      .setAudience('https://analyticsdata.googleapis.com/')
      .sign(privateKeyObject)

    console.log('JWT created successfully')

    // Make request to GA4 API
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
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

    if (!response.ok) {
      const error = await response.text()
      console.error('GA4 API error:', error)
      throw new Error(`GA4 API returned ${response.status}: ${error}`)
    }

    const data = await response.json()
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