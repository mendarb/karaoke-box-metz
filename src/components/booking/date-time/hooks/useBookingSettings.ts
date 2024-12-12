import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { defaultSettings } from "../../../admin/settings/hooks/bookingSettingsTypes";
import { useToast } from "@/components/ui/use-toast";

export const useBookingSettings = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      console.log('Fetching booking settings...');
      
      try {
        // First, try to get existing settings
        const { data: existingSettings, error: fetchError } = await supabase
          .from('booking_settings')
          .select('*')
          .eq('key', 'booking_settings')
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching settings:', fetchError);
          throw fetchError;
        }

        // If settings exist, return them
        if (existingSettings) {
          console.log('Found existing settings:', existingSettings);
          return existingSettings.value;
        }

        console.log('No settings found, creating defaults...');
        
        // If no settings exist, create default ones
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
          toast({
            title: "Erreur",
            description: "Impossible de créer les paramètres par défaut. Veuillez réessayer.",
            variant: "destructive",
          });
          throw insertError;
        }

        console.log('Successfully created default settings:', newSettings);
        return newSettings.value;
      } catch (error) {
        console.error('Settings operation failed:', error);
        // Return default settings as fallback
        return defaultSettings;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache results for 30 seconds
    meta: {
      errorMessage: "Erreur lors du chargement des paramètres"
    }
  });
};