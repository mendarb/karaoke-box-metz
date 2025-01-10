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
    const measurementId = 'G-NYBP6KX13X';

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.GA_MEASUREMENT_ID = measurementId;

    window.gtag('config', measurementId, {
      send_page_view: false,
      cookie_domain: 'reservation-kbox.netlify.app',
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
      client_storage: 'none',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

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

// Nouveaux événements de suivi pour les réservations
export const trackBookingEvent = (
  eventName: 'booking_started' | 'booking_completed' | 'payment_initiated' | 'payment_completed',
  eventParams?: Record<string, any>
) => {
  try {
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      const baseParams = {
        send_to: window.GA_MEASUREMENT_ID,
        ...eventParams
      };

      // Paramètres spécifiques selon le type d'événement
      const eventSpecificParams = {
        booking_started: {
          event_category: 'Booking',
          event_label: 'Start Booking Process'
        },
        booking_completed: {
          event_category: 'Booking',
          event_label: 'Complete Booking',
          value: eventParams?.price
        },
        payment_initiated: {
          event_category: 'Payment',
          event_label: 'Start Payment',
          value: eventParams?.price
        },
        payment_completed: {
          event_category: 'Payment',
          event_label: 'Complete Payment',
          value: eventParams?.price,
          transaction_id: eventParams?.bookingId
        }
      };

      window.gtag('event', eventName, {
        ...baseParams,
        ...eventSpecificParams[eventName]
      });

      console.log(`GA4 event tracked: ${eventName}`, {
        ...baseParams,
        ...eventSpecificParams[eventName]
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const trackEngagementEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  try {
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      window.gtag('event', eventName, {
        ...eventParams,
        send_to: window.GA_MEASUREMENT_ID,
        event_category: 'Engagement'
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};