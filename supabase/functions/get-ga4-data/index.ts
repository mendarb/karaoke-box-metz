import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL')
    const privateKey = Deno.env.get('GA4_PRIVATE_KEY')?.replace(/\\n/g, '\n')
    const propertyId = Deno.env.get('GA4_PROPERTY_ID')

    if (!clientEmail || !privateKey || !propertyId) {
      console.error('Missing required environment variables:', {
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey,
        hasPropertyId: !!propertyId
      })
      throw new Error('Missing required GA4 credentials')
    }

    // Create JWT token
    const header = { alg: 'RS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const claim = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://analyticsdata.googleapis.com/',
      iat: now,
      exp: now + 3600
    }

    // Encode JWT parts
    const encodedHeader = btoa(JSON.stringify(header))
    const encodedClaim = btoa(JSON.stringify(claim))
    const signInput = `${encodedHeader}.${encodedClaim}`

    // Sign JWT
    const keyData = privateKey.trim()
    const key = await crypto.subtle.importKey(
      'pkcs8',
      new TextEncoder().encode(keyData),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      key,
      new TextEncoder().encode(signInput)
    )
    const jwt = `${signInput}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`

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