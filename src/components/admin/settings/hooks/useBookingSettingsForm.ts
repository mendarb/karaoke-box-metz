import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { BookingSettings, defaultSettings } from "../types/bookingSettings";

export const useBookingSettingsForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<BookingSettings>();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      try {
        console.log('Fetching booking settings...');
        const { data: existingSettings, error: fetchError } = await supabase
          .from('booking_settings')
          .select('*')
          .eq('key', 'booking_settings')
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching settings:', fetchError);
          return defaultSettings;
        }

        if (!existingSettings) {
          console.log('No settings found, creating defaults...');
          const { error: insertError } = await supabase
            .from('booking_settings')
            .insert([{ 
              key: 'booking_settings', 
              value: defaultSettings 
            }]);

          if (insertError) {
            console.error('Error creating default settings:', insertError);
            return defaultSettings;
          }

          return defaultSettings;
        }

        console.log('Loaded settings:', existingSettings.value);
        return existingSettings.value as BookingSettings;
      } catch (err) {
        console.error('Query error:', err);
        return defaultSettings;
      }
    },
    retry: 2,
    staleTime: 30000,
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      console.log('Starting settings save:', data);
      const { data: existingSettings, error: checkError } = await supabase
        .from('booking_settings')
        .select('id')
        .eq('key', 'booking_settings')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing settings:', checkError);
        throw checkError;
      }

      if (existingSettings) {
        console.log('Updating existing settings...');
        const { error } = await supabase
          .from('booking_settings')
          .update({ value: data })
          .eq('key', 'booking_settings');

        if (error) {
          console.error('Error updating settings:', error);
          throw error;
        }
      } else {
        console.log('Creating new settings...');
        const { error } = await supabase
          .from('booking_settings')
          .insert([{ 
            key: 'booking_settings',
            value: data 
          }]);

        if (error) {
          console.error('Error creating settings:', error);
          throw error;
        }
      }
      console.log('Settings saved successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été sauvegardés avec succès.",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres.",
        variant: "destructive",
      });
    },
  });

  return {
    form,
    settings,
    isLoadingSettings,
    mutation,
  };
};