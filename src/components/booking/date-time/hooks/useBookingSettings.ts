import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";
import { toast } from "@/hooks/use-toast";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const useBookingSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('Fetching booking settings...');
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de réservation",
          variant: "destructive",
        });
        throw error;
      }

      if (!data?.value) {
        console.log('No settings found');
        return null;
      }

      console.log('Loaded settings:', data.value);
      return data.value as BookingSettings;
    },
    retry: 1,
    staleTime: 30000,
  });

  const today = startOfDay(new Date());
  
  // En mode test, on permet de réserver dès aujourd'hui et jusqu'à un an
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('Date boundaries:', {
    minDate,
    maxDate,
    isTestMode: settings?.isTestMode,
    startDays: settings?.bookingWindow?.startDays,
    endDays: settings?.bookingWindow?.endDays
  });

  return {
    settings,
    isLoading,
    minDate,
    maxDate
  };
};