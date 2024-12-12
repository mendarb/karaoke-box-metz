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
          .select('value')
          .eq('key', 'booking_settings')
          .single();

        if (fetchError) {
          console.error('Error fetching settings:', fetchError);
          throw fetchError;
        }

        if (!existingSettings) {
          console.log('No settings found, creating defaults...');
          const { data: newSettings, error: insertError } = await supabase
            .from('booking_settings')
            .insert([{ 
              key: 'booking_settings', 
              value: defaultSettings 
            }])
            .select('value')
            .single();

          if (insertError) {
            console.error('Error creating default settings:', insertError);
            throw insertError;
          }

          console.log('Default settings created:', newSettings);
          return newSettings.value as BookingSettings;
        }

        console.log('Loaded settings:', existingSettings.value);
        return existingSettings.value as BookingSettings;
      } catch (err) {
        console.error('Query error:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 30000,
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      console.log('Starting settings save:', data);
      const { error: upsertError } = await supabase
        .from('booking_settings')
        .upsert({ 
          key: 'booking_settings',
          value: data 
        }, {
          onConflict: 'key'
        });

      if (upsertError) {
        console.error('Error saving settings:', upsertError);
        throw upsertError;
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