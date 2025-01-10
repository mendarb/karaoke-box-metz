import { supabase } from '@/lib/supabase';

interface GA4Data {
  summary: {
    activeUsers: number;
    pageViews: number;
    sessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    engagementRate: number;
    totalUsers: number;
    bookingStarts: number;
    bookingCompletions: number;
    paymentInitiations: number;
    paymentCompletions: number;
  };
  byDate: Record<string, {
    activeUsers: number;
    pageViews: number;
    sessions: number;
    bookingStarts: number;
    bookingCompletions: number;
  }>;
  byDevice: Record<string, {
    sessions: number;
    users: number;
  }>;
  byCountry: Record<string, {
    sessions: number;
    users: number;
  }>;
}

export const getGA4Data = async (startDate?: string, endDate?: string): Promise<GA4Data | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-ga4-data', {
      body: { startDate, endDate }
    });
    
    if (error) {
      console.error('Error fetching GA4 data:', error);
      return null;
    }

    return data as GA4Data;
  } catch (error) {
    console.error('Error in getGA4Data:', error);
    return null;
  }
};

export const initGA4 = () => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-NYBP6KX13X`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-NYBP6KX13X', {
      custom_map: {
        dimension1: 'booking_type',
        dimension2: 'payment_method',
        metric1: 'booking_value',
        metric2: 'booking_duration'
      }
    });

    window.gtag = gtag;
  }
};

export const trackGA4Event = ({ name, params = {} }: { name: string; params?: Record<string, any> }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Ajout de paramètres communs pour tous les événements
    const enhancedParams = {
      ...params,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE
    };

    window.gtag('event', name, enhancedParams);
    console.log(`GA4 event tracked: ${name}`, enhancedParams);
  }
};