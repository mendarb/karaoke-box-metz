import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { defaultSettings } from "../../../admin/settings/hooks/bookingSettingsTypes";

export const useBookingSettings = () => {
  return useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('Fetching booking settings...');
      
      // Vérifier si les paramètres existent déjà
      const { data: existingSettings, error: fetchError } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching settings:', fetchError);
        throw fetchError;
      }

      // Si aucun paramètre n'existe, créer les paramètres par défaut
      if (!existingSettings) {
        console.log('No settings found, creating defaults...');
        const { data: newSettings, error: insertError } = await supabase
          .from('booking_settings')
          .insert([{ 
            key: 'booking_settings', 
            value: defaultSettings 
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }

        console.log('Default settings created:', newSettings);
        return newSettings.value;
      }

      console.log('Loaded settings:', existingSettings);
      return existingSettings.value;
    },
    retry: 1,
    staleTime: 30000, // Cache les résultats pendant 30 secondes
  });
};