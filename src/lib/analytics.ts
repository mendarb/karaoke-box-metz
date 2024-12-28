import { supabase } from './supabase';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initializeGoogleAnalytics = async () => {
  try {
    const { data: { secret } } = await supabase.functions.invoke('get-secret', {
      body: { name: 'GA_MEASUREMENT_ID' }
    });

    if (!secret) {
      console.error('Google Analytics Measurement ID not found');
      return;
    }

    // Ajouter le script Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${secret}`;
    document.head.appendChild(script);

    // Initialiser gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', secret, {
      send_page_view: false // Nous gérerons manuellement les pages vues
    });

    return secret;
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
};

export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
    });
  }
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};