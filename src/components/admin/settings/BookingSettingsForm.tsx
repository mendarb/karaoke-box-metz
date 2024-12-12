import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { OpeningHoursSettings } from "./settings/OpeningHoursSettings";
import { BookingWindowSettings } from "./settings/BookingWindowSettings";
import { ExcludedDaysSettings } from "./settings/ExcludedDaysSettings";
import { PricingSettings } from "./settings/PricingSettings";
import { Card, CardContent } from "@/components/ui/card";

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

const defaultSettings: BookingSettings = {
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

export const BookingSettingsForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<BookingSettings>();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('booking_settings')
          .select('*')
          .eq('key', 'booking_settings')
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
          // Si aucun paramètre n'existe, créer les paramètres par défaut
          const { error: insertError } = await supabase
            .from('booking_settings')
            .insert([{ key: 'booking_settings', value: defaultSettings }]);

          if (insertError) {
            console.error('Error creating default settings:', insertError);
            throw insertError;
          }
          return defaultSettings;
        }

        console.log("Loaded settings:", data?.value);
        return data?.value as BookingSettings || defaultSettings;
      } catch (err) {
        console.error('Query error:', err);
        return defaultSettings;
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      const { error } = await supabase
        .from('booking_settings')
        .upsert({ 
          key: 'booking_settings',
          value: data 
        });

      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été sauvegardés avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingSettings) => {
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <PricingSettings form={form} defaultValue={settings?.basePrice} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <BookingWindowSettings form={form} defaultValue={settings?.bookingWindow} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <OpeningHoursSettings form={form} defaultValue={settings?.openingHours} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ExcludedDaysSettings form={form} defaultValue={settings?.excludedDays} />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            "Sauvegarder les modifications"
          )}
        </Button>
      </form>
    </Form>
  );
};