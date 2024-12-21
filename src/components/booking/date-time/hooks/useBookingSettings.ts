import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";
import { toast } from "@/components/ui/use-toast";

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
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de réservation",
          variant: "destructive",
        });
        throw error;
      }

      if (!data?.value) {
        console.log('⚠️ Aucun paramètre trouvé, utilisation des valeurs par défaut');
        return {
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
      }

      console.log('✅ Paramètres chargés:', data.value);
      return data.value;
    },
  });

  const today = startOfDay(new Date());
  
  const minDate = settings?.isTestMode 
    ? today
    : addDays(today, settings?.bookingWindow?.startDays || 1);
    
  const maxDate = settings?.isTestMode
    ? addDays(today, 365)
    : addDays(today, settings?.bookingWindow?.endDays || 30);

  console.log('📅 Limites de dates calculées:', { 
    minDate, 
    maxDate, 
    isTestMode: settings?.isTestMode,
    startDays: settings?.bookingWindow?.startDays,
    endDays: settings?.bookingWindow?.endDays
  });

  return {
    settings,
    isLoading,
    error,
    minDate,
    maxDate
  };
};