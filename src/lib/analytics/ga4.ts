import { supabase } from '@/lib/supabase';

const GA4_MEASUREMENT_ID = '471434397';

interface GA4Event {
  name: string;
  params?: Record<string, any>;
}

export const initGA4 = () => {
  if (typeof window !== 'undefined') {
    // Initialize Google Analytics 4
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-${GA4_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', `G-${GA4_MEASUREMENT_ID}`);

    // Make gtag available globally
    window.gtag = gtag;
  }
};

export const trackGA4Event = ({ name, params = {} }: GA4Event) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
};

export const getGA4Data = async () => {
  try {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'ga4_credentials')
      .single();

    if (!settings?.value) {
      console.warn('GA4 credentials not found in site settings');
      return null;
    }

    // Here you would implement the actual GA4 API calls using the credentials
    // For now, we'll return mock data
    return {
      activeUsers: Math.floor(Math.random() * 100),
      pageViews: Math.floor(Math.random() * 1000),
      sessions: Math.floor(Math.random() * 500),
      averageSessionDuration: Math.floor(Math.random() * 300),
    };
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return null;
  }
};