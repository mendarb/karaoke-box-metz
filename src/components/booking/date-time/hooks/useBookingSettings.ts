import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const defaultSettings = {
  isTestMode: false,
  openingHours: {
    1: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    2: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    3: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    4: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    5: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    6: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
    0: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] },
  },
  excludedDays: [],
  bookingWindow: {
    startDays: 1,
    endDays: 30
  }
};

export const useBookingSettings = () => {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('📚 Chargement des paramètres de réservation...');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .maybeSingle();

      if (error) {
        console.error('❌ Erreur lors du chargement des paramètres:', error);
        return defaultSettings;
      }

      if (!data?.value) {
        console.log('⚠️ Aucun paramètre trouvé, utilisation des valeurs par défaut');
        return defaultSettings;
      }

      console.log('✅ Paramètres chargés:', data.value);
      return data.value;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const today = startOfDay(new Date());
  
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || defaultSettings.bookingWindow.startDays);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || defaultSettings.bookingWindow.endDays);

  console.log('📅 Limites de dates calculées:', { 
    minDate, 
    maxDate, 
    isTestMode: settings?.isTestMode,
    startDays: settings?.bookingWindow?.startDays,
    endDays: settings?.bookingWindow?.endDays
  });

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    minDate,
    maxDate
  };
};