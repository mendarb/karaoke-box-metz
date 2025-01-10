export async function fetchGA4Data(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  console.log('Fetching GA4 data with:', { propertyId, startDate, endDate });
  
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
          { name: 'totalUsers' },
          { 
            name: 'customEvent:booking_started',
            expression: "countIf(eventName == 'booking_started')"
          },
          { 
            name: 'customEvent:booking_completed',
            expression: "countIf(eventName == 'booking_completed')"
          },
          { 
            name: 'customEvent:payment_initiated',
            expression: "countIf(eventName == 'payment_initiated')"
          },
          { 
            name: 'customEvent:payment_completed',
            expression: "countIf(eventName == 'payment_completed')"
          }
        ],
        dimensions: [
          { name: 'date' },
          { name: 'deviceCategory' },
          { name: 'country' }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('GA4 API error:', error);
    throw new Error(`GA4 API returned ${response.status}: ${error}`);
  }

  const data = await response.json();
  console.log('GA4 API response:', JSON.stringify(data, null, 2));
  return data;
}

export function processGA4Data(data: any) {
  const processedData = {
    summary: {
      activeUsers: 0,
      pageViews: 0,
      sessions: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      engagementRate: 0,
      totalUsers: 0,
      bookingStarts: 0,
      bookingCompletions: 0,
      paymentInitiations: 0,
      paymentCompletions: 0
    },
    byDate: {},
    byDevice: {},
    byCountry: {}
  };

  data.rows?.forEach((row: any) => {
    const date = row.dimensionValues[0].value;
    const device = row.dimensionValues[1].value;
    const country = row.dimensionValues[2].value;
    const metrics = row.metricValues.map((m: any) => parseFloat(m.value));

    // Métriques de base
    processedData.summary.activeUsers += metrics[0];
    processedData.summary.pageViews += metrics[1];
    processedData.summary.sessions += metrics[2];
    processedData.summary.averageSessionDuration = metrics[3];
    processedData.summary.bounceRate = metrics[4];
    processedData.summary.engagementRate = metrics[6];
    processedData.summary.totalUsers = metrics[8];

    // Événements personnalisés
    processedData.summary.bookingStarts += metrics[9] || 0;
    processedData.summary.bookingCompletions += metrics[10] || 0;
    processedData.summary.paymentInitiations += metrics[11] || 0;
    processedData.summary.paymentCompletions += metrics[12] || 0;

    // Données par date
    if (!processedData.byDate[date]) {
      processedData.byDate[date] = {
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        bookingStarts: 0,
        bookingCompletions: 0
      };
    }
    processedData.byDate[date].activeUsers += metrics[0];
    processedData.byDate[date].pageViews += metrics[1];
    processedData.byDate[date].sessions += metrics[2];
    processedData.byDate[date].bookingStarts += metrics[9] || 0;
    processedData.byDate[date].bookingCompletions += metrics[10] || 0;

    // Données par appareil
    if (!processedData.byDevice[device]) {
      processedData.byDevice[device] = {
        sessions: 0,
        users: 0
      };
    }
    processedData.byDevice[device].sessions += metrics[2];
    processedData.byDevice[device].users += metrics[0];

    // Données par pays
    if (!processedData.byCountry[country]) {
      processedData.byCountry[country] = {
        sessions: 0,
        users: 0
      };
    }
    processedData.byCountry[country].sessions += metrics[2];
    processedData.byCountry[country].users += metrics[0];
  });

  console.log('Processed GA4 data:', processedData);
  return processedData;
}