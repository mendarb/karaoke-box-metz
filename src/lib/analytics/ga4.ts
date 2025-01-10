import { supabase } from '@/lib/supabase';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface GA4Data {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  averageSessionDuration: number;
}

export const getGA4Data = async (): Promise<GA4Data | null> => {
  try {
    // Récupérer la clé API depuis les secrets Supabase
    const { data: { secret } } = await supabase.functions.invoke('get-secret', {
      body: { name: 'GA4_API_KEY' }
    });

    if (!secret) {
      console.error('GA4 API key not found');
      return null;
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: 'your-service-account@your-project.iam.gserviceaccount.com',
        private_key: secret,
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/471434397`,
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
      return {
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        averageSessionDuration: 0,
      };
    }

    const metrics = response.rows[0].metricValues;
    
    return {
      activeUsers: parseInt(metrics?.[0]?.value || '0'),
      pageViews: parseInt(metrics?.[1]?.value || '0'),
      sessions: parseInt(metrics?.[2]?.value || '0'),
      averageSessionDuration: parseFloat(metrics?.[3]?.value || '0'),
    };
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return null;
  }
};

export const initGA4 = () => {
  if (typeof window !== 'undefined') {
    // Initialize Google Analytics 4
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-471434397`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-471434397');

    // Make gtag available globally
    window.gtag = gtag;
  }
};

export const trackGA4Event = ({ name, params = {} }: { name: string; params?: Record<string, any> }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
};