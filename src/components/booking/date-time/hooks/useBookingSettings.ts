import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";

export const useBookingSettings = () => {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('📚 Chargement des paramètres de réservation...');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) {
        console.error('❌ Erreur lors du chargement des paramètres:', error);
        throw error;
      }

      console.log('✅ Paramètres chargés:', data?.value);
      return data?.value;
    },
  });

  const isTestMode = import.meta.env.VITE_STRIPE_MODE === 'test';
  
  // Utiliser les dates de la fenêtre de réservation depuis les paramètres
  const minDate = settings?.bookingWindow?.startDate 
    ? new Date(settings.bookingWindow.startDate)
    : addDays(startOfDay(new Date()), 1);
    
  const maxDate = settings?.bookingWindow?.endDate
    ? new Date(settings.bookingWindow.endDate)
    : addDays(startOfDay(new Date()), 30);

  console.log('📅 Plage de dates:', { minDate, maxDate, isTestMode });

  return {
    settings,
    isLoading,
    error,
    minDate,
    maxDate,
    isTestMode
  };
};