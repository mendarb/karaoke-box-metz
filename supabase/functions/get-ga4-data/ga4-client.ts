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
          { name: 'userEngagementDuration' },
          { name: 'engagedSessions' },
          { name: 'bounceRate' },
          { name: 'engagementRate' },
          { name: 'totalUsers' }
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

  return response.json();
}

export function processGA4Data(data: any) {
  console.log('Processing raw GA4 data:', data);

  const processedData = {
    summary: {
      activeUsers: 0,
      pageViews: 0,
      sessions: 0,
      averageEngagementTime: 0,
      bounceRate: 0,
      engagementRate: 0,
      totalUsers: 0
    },
    byDate: {},
    byDevice: {},
    byCountry: {}
  };

  if (!data.rows) {
    console.warn('No rows found in GA4 data');
    return processedData;
  }

  let totalEngagementTime = 0;
  let totalSessions = 0;
  let engagedSessions = 0;

  data.rows.forEach((row: any) => {
    const metrics = row.metricValues.map((m: any) => parseFloat(m.value));

    // Aggregate summary metrics
    processedData.summary.activeUsers += metrics[0] || 0;
    processedData.summary.pageViews += metrics[1] || 0;
    processedData.summary.sessions += metrics[2] || 0;
    totalEngagementTime += metrics[3] || 0;
    engagedSessions += metrics[4] || 0;
    
    // Store total sessions for rate calculations
    totalSessions += metrics[2] || 0;
    
    // Update total users
    processedData.summary.totalUsers = Math.max(processedData.summary.totalUsers, metrics[7] || 0);
  });

  // Calculate rates and averages
  processedData.summary.bounceRate = totalSessions > 0 ? ((totalSessions - engagedSessions) / totalSessions) * 100 : 0;
  processedData.summary.engagementRate = totalSessions > 0 ? (engagedSessions / totalSessions) * 100 : 0;
  processedData.summary.averageEngagementTime = totalSessions > 0 ? Math.round(totalEngagementTime / totalSessions) : 0;

  // Log processed metrics for debugging
  console.log('Processed GA4 metrics:', {
    activeUsers: processedData.summary.activeUsers,
    pageViews: processedData.summary.pageViews,
    sessions: processedData.summary.sessions,
    engagementRate: processedData.summary.engagementRate.toFixed(2) + '%',
    bounceRate: processedData.summary.bounceRate.toFixed(2) + '%',
    avgEngagementTime: processedData.summary.averageEngagementTime + 's'
  });

  return processedData;
}