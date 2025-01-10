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
  };
  byDate: Record<string, {
    activeUsers: number;
    pageViews: number;
    sessions: number;
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
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const { data, error } = await supabase.functions.invoke('get-ga4-data', {
      query: params
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