import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { OpeningHoursSettings } from "./settings/OpeningHoursSettings";
import { BookingWindowSettings } from "./settings/BookingWindowSettings";
import { ExcludedDaysSettings } from "./settings/ExcludedDaysSettings";
import { PricingSettings } from "./settings/PricingSettings";

interface BookingSettings {
  isTestMode: boolean;
  bookingWindow: {
    startDays: number;
    endDays: number;
  };
  openingHours: {
    [key: string]: {
      isOpen: boolean;
      slots: string[];
    };
  };
  excludedDays: number[];
  basePrice: {
    perHour: number;
    perPerson: number;
  };
}

export const BookingSettingsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<BookingSettings>();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*');

      if (error) throw error;

      const formattedSettings: BookingSettings = {
        isTestMode: false,
        bookingWindow: { startDays: 1, endDays: 30 },
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
        basePrice: { perHour: 30, perPerson: 5 },
      };

      data?.forEach(setting => {
        switch (setting.key) {
          case 'booking_window':
            formattedSettings.bookingWindow = setting.value;
            break;
          case 'opening_hours':
            formattedSettings.openingHours = setting.value;
            break;
          case 'excluded_days':
            formattedSettings.excludedDays = setting.value;
            break;
          case 'base_price':
            formattedSettings.basePrice = setting.value;
            break;
          case 'is_test_mode':
            formattedSettings.isTestMode = setting.value;
            break;
        }
      });

      console.log("Loaded settings:", formattedSettings);
      return formattedSettings;
    },
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      setIsLoading(true);
      try {
        console.log("Saving settings:", data);
        const updates = [
          { key: 'booking_window', value: data.bookingWindow },
          { key: 'opening_hours', value: data.openingHours },
          { key: 'excluded_days', value: data.excludedDays },
          { key: 'base_price', value: data.basePrice },
          { key: 'is_test_mode', value: data.isTestMode }
        ];

        for (const update of updates) {
          const { error } = await supabase
            .from('booking_settings')
            .update({ value: update.value })
            .eq('key', update.key);

          if (error) throw error;
        }

        toast({
          title: "Paramètres mis à jour",
          description: "Les paramètres de réservation ont été mis à jour avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour des paramètres.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-settings'] });
    }
  });

  const onSubmit = (data: BookingSettings) => {
    console.log("Form submission data:", data);
    mutation.mutate(data);
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookingWindowSettings form={form} defaultValue={settings?.bookingWindow} />
        <OpeningHoursSettings form={form} defaultValue={settings?.openingHours} />
        <ExcludedDaysSettings form={form} defaultValue={settings?.excludedDays} />
        <PricingSettings form={form} defaultValue={settings?.basePrice} />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mise à jour...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </form>
    </Form>
  );
};