import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SignJWT } from "https://deno.land/x/jose@v4.9.1/index.ts"
import { decode as base64Decode } from "https://deno.land/std@0.129.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  console.log('Starting private key import...')
  
  // Clean the key string first
  let cleanKey = pem
    .replace(/\\n/g, '\n')  // Replace escaped newlines with actual newlines
    .replace(/["']/g, '')   // Remove any quotes
    .trim()                 // Remove leading/trailing whitespace

  // Extract the base64 content between the markers
  const matches = cleanKey.match(/-----BEGIN PRIVATE KEY-----\n?([\s\S]+)\n?-----END PRIVATE KEY-----/)
  if (!matches || !matches[1]) {
    throw new Error('Invalid PEM format: Missing key content')
  }

  const base64Content = matches[1].replace(/\s/g, '')
  console.log('Base64 content length:', base64Content.length)
  
  try {
    const binaryDer = base64Decode(base64Content)
    console.log('Binary DER length:', binaryDer.length)

    return await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    )
  } catch (error) {
    console.error('Error importing private key:', error)
    console.error('Key details:', {
      originalLength: pem.length,
      cleanedLength: cleanKey.length,
      base64Length: base64Content.length,
    })
    throw error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const startDate = url.searchParams.get('startDate') || '30daysAgo'
    const endDate = url.searchParams.get('endDate') || 'today'

    const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL')
    const privateKey = Deno.env.get('GA4_PRIVATE_KEY')
    const propertyId = Deno.env.get('GA4_PROPERTY_ID')

    if (!clientEmail || !privateKey || !propertyId) {
      console.error('Missing required environment variables')
      throw new Error('Missing required GA4 credentials')
    }

    console.log('Starting GA4 data fetch with:', {
      clientEmail,
      propertyId,
      startDate,
      endDate
    })

    const key = await importPrivateKey(privateKey)
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
      .sign(key)

    console.log('JWT token created, requesting access token...')

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

    const ga4Response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
            { name: 'engagedSessions' },
            { name: 'engagementRate' },
            { name: 'eventsPerSession' },
            { name: 'totalUsers' }
          ],
          dimensions: [
            { name: 'date' },
            { name: 'deviceCategory' },
            { name: 'country' }
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

    // Traitement des données pour les rendre plus faciles à utiliser
    const processedData = {
      summary: {
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        engagementRate: 0,
        totalUsers: 0
      },
      byDate: {},
      byDevice: {},
      byCountry: {}
    }

    // Traitement des lignes de données
    data.rows?.forEach((row: any) => {
      const date = row.dimensionValues[0].value
      const device = row.dimensionValues[1].value
      const country = row.dimensionValues[2].value
      const metrics = row.metricValues.map((m: any) => parseFloat(m.value))

      // Mise à jour des totaux
      processedData.summary.activeUsers += metrics[0]
      processedData.summary.pageViews += metrics[1]
      processedData.summary.sessions += metrics[2]
      processedData.summary.averageSessionDuration = metrics[3]
      processedData.summary.bounceRate = metrics[4]
      processedData.summary.engagementRate = metrics[6]
      processedData.summary.totalUsers = metrics[8]

      // Données par date
      if (!processedData.byDate[date]) {
        processedData.byDate[date] = {
          activeUsers: 0,
          pageViews: 0,
          sessions: 0
        }
      }
      processedData.byDate[date].activeUsers += metrics[0]
      processedData.byDate[date].pageViews += metrics[1]
      processedData.byDate[date].sessions += metrics[2]

      // Données par appareil
      if (!processedData.byDevice[device]) {
        processedData.byDevice[device] = {
          sessions: 0,
          users: 0
        }
      }
      processedData.byDevice[device].sessions += metrics[2]
      processedData.byDevice[device].users += metrics[0]

      // Données par pays
      if (!processedData.byCountry[country]) {
        processedData.byCountry[country] = {
          sessions: 0,
          users: 0
        }
      }
      processedData.byCountry[country].sessions += metrics[2]
      processedData.byCountry[country].users += metrics[0]
    })

    return new Response(
      JSON.stringify(processedData),
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
    )
  }
})