import { supabase } from '@/lib/supabase';

interface GA4Data {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  averageSessionDuration: number;
}

export const getGA4Data = async (): Promise<GA4Data | null> => {
  try {
    // Utiliser la fonction Edge pour obtenir les données GA4
    const { data, error } = await supabase.functions.invoke('get-ga4-data');
    
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