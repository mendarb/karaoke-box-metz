import { supabase } from './supabase';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    GA_MEASUREMENT_ID?: string;
  }
}

export const initializeGoogleAnalytics = async () => {
  try {
    // Use hardcoded measurement ID instead of fetching from secrets
    const measurementId = 'G-NYBP6KX13X';

    // Configuration de base de gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.GA_MEASUREMENT_ID = measurementId;

    // Configuration avancée
    window.gtag('config', measurementId, {
      send_page_view: false,
      cookie_domain: 'reservation-kbox.netlify.app',
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
      client_storage: 'none',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    console.log('✅ Google Analytics initialized successfully');
    return measurementId;
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
};

export const trackPageView = (path: string) => {
  try {
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      window.gtag('event', 'page_view', {
        page_path: path,
        send_to: window.GA_MEASUREMENT_ID
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  try {
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      window.gtag('event', eventName, {
        ...eventParams,
        send_to: window.GA_MEASUREMENT_ID
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};