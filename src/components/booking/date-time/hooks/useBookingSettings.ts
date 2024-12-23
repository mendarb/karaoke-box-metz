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
        .maybeSingle();

      if (error) {
        console.error('❌ Erreur lors du chargement des paramètres:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de réservation",
          variant: "destructive",
        });
        return null;
      }

      if (!data?.value) {
        console.log('⚠️ Aucun paramètre trouvé');
        return null;
      }

      console.log('✅ Paramètres chargés:', data.value);
      return data.value;
    },
  });

  // Utiliser directement les dates de la fenêtre de réservation depuis les paramètres
  const minDate = settings?.bookingWindow?.startDate 
    ? new Date(settings.bookingWindow.startDate)
    : startOfDay(addDays(new Date(), 1));
    
  const maxDate = settings?.bookingWindow?.endDate
    ? new Date(settings.bookingWindow.endDate)
    : startOfDay(addDays(new Date(), 30));

  console.log('📅 Limites de dates calculées:', { 
    minDate, 
    maxDate,
    rawSettings: settings
  });

  return {
    settings,
    isLoading,
    error,
    minDate,
    maxDate
  };
};