import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { BookingSettings, defaultSettings } from "./bookingSettingsTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, startOfDay } from "date-fns";

export const useBookingSettingsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  
  const form = useForm<BookingSettings>({
    defaultValues: {
      ...defaultSettings,
      bookingWindow: {
        startDate: startOfDay(addDays(new Date(), 1)),
        endDate: startOfDay(addDays(new Date(), 30)),
      }
    },
  });

  // Query to fetch settings
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('booking_settings')
          .select('*')
          .eq('key', 'booking_settings')
          .single();

        if (error) throw error;
        
        // Convert string dates to Date objects
        if (data?.value?.bookingWindow) {
          data.value.bookingWindow.startDate = data.value.bookingWindow.startDate 
            ? new Date(data.value.bookingWindow.startDate)
            : startOfDay(addDays(new Date(), 1));
          data.value.bookingWindow.endDate = data.value.bookingWindow.endDate
            ? new Date(data.value.bookingWindow.endDate)
            : startOfDay(addDays(new Date(), 30));
        }
        
        return data?.value;
      } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
      }
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      console.log('Settings loaded:', settings);
      form.reset(settings);
      setIsLoading(false);
    }
  }, [settings, form]);

  // Mutation to save settings
  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      console.log('Saving settings:', data);
      const { error } = await supabase
        .from('booking_settings')
        .upsert(
          { 
            key: 'booking_settings',
            value: data 
          },
          { 
            onConflict: 'key',
          }
        );

      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-settings'] });
      toast({
        title: "Succès",
        description: "Les paramètres ont été enregistrés",
      });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BookingSettings) => {
    mutation.mutate(data);
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};