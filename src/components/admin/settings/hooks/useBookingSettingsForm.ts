import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { BookingSettings, defaultSettings } from "./bookingSettingsTypes";

export const useBookingSettingsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<BookingSettings>({
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('booking_settings')
          .select('*')
          .eq('key', 'settings')
          .single();

        if (error) throw error;

        if (data) {
          console.log('Settings loaded:', data.value);
          form.reset(data.value);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form, toast]);

  const onSubmit = async (data: BookingSettings) => {
    try {
      console.log('Saving settings:', data);
      const { error } = await supabase
        .from('booking_settings')
        .upsert({
          key: 'settings',
          value: data,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres ont été enregistrés",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};