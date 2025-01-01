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

    // Supprimer l'ancien script s'il existe
    const existingScript = document.querySelector('script[src*="googletagmanager"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Configuration de base de gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());

    // Configuration avancée pour gérer les problèmes de cookies
    window.gtag('config', secret, {
      send_page_view: false,
      cookie_domain: 'reservation-kbox.netlify.app',
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
      client_storage: 'none', // Désactive le stockage côté client si nécessaire
      allow_google_signals: false, // Désactive les signaux Google
      allow_ad_personalization_signals: false // Désactive la personnalisation des annonces
    });

    // Ajouter le nouveau script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${secret}`;
    document.head.appendChild(script);

    return secret;
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
};

export const trackPageView = (path: string) => {
  try {
    if (window.gtag) {
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
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        send_to: window.GA_MEASUREMENT_ID
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};