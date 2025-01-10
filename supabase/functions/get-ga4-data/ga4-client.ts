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
          { name: 'eventCount' }
        ],
        dimensions: [
          { name: 'date' },
          { name: 'deviceCategory' },
          { name: 'country' },
          { name: 'eventName' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "form_start",
              matchType: "EXACT"
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('GA4 API error:', error);
    throw new Error(`GA4 API returned ${response.status}: ${error}`);
  }

  return response.json();
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
      formStartCount: 0
    },
    byDate: {},
    byDevice: {},
    byCountry: {}
  };

  data.rows?.forEach((row: any) => {
    const date = row.dimensionValues[0].value;
    const device = row.dimensionValues[1].value;
    const country = row.dimensionValues[2].value;
    const eventName = row.dimensionValues[3].value;
    const metrics = row.metricValues.map((m: any) => parseFloat(m.value));

    processedData.summary.activeUsers += metrics[0];
    processedData.summary.pageViews += metrics[1];
    processedData.summary.sessions += metrics[2];
    processedData.summary.averageSessionDuration = metrics[3];
    processedData.summary.bounceRate = metrics[4];
    processedData.summary.engagementRate = metrics[6];
    processedData.summary.totalUsers = metrics[8];
    
    if (eventName === 'form_start') {
      processedData.summary.formStartCount += metrics[9] || 0;
    }

    if (!processedData.byDate[date]) {
      processedData.byDate[date] = {
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        formStartCount: 0
      };
    }
    processedData.byDate[date].activeUsers += metrics[0];
    processedData.byDate[date].pageViews += metrics[1];
    processedData.byDate[date].sessions += metrics[2];
    if (eventName === 'form_start') {
      processedData.byDate[date].formStartCount += metrics[9] || 0;
    }

    if (!processedData.byDevice[device]) {
      processedData.byDevice[device] = {
        sessions: 0,
        users: 0
      };
    }
    processedData.byDevice[device].sessions += metrics[2];
    processedData.byDevice[device].users += metrics[0];

    if (!processedData.byCountry[country]) {
      processedData.byCountry[country] = {
        sessions: 0,
        users: 0
      };
    }
    processedData.byCountry[country].sessions += metrics[2];
    processedData.byCountry[country].users += metrics[0];
  });

  return processedData;
}