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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingSettings {
  timeSlots: string[];
  bookingWindow: {
    startDays: number;
    endDays: number;
  };
  discounts: Array<{
    type: string;
    hours: number;
    percentage: number;
  }>;
  basePrice: {
    perHour: number;
    perPerson: number;
  };
  closedDays: number[];
  emailTemplates: {
    confirmation: {
      subject: string;
      paid: string;
      pending: string;
    };
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

      // Convertir les données en format utilisable
      const formattedSettings: BookingSettings = {
        timeSlots: [],
        bookingWindow: { startDays: 1, endDays: 60 },
        discounts: [],
        basePrice: { perHour: 30, perPerson: 5 },
        closedDays: [1],
        emailTemplates: {
          confirmation: {
            subject: "",
            paid: "",
            pending: ""
          }
        }
      };

      data.forEach(setting => {
        switch (setting.key) {
          case 'time_slots':
            formattedSettings.timeSlots = setting.value;
            break;
          case 'booking_window':
            formattedSettings.bookingWindow = setting.value;
            break;
          case 'discounts':
            formattedSettings.discounts = setting.value;
            break;
          case 'base_price':
            formattedSettings.basePrice = setting.value;
            break;
          case 'closed_days':
            formattedSettings.closedDays = setting.value;
            break;
          case 'email_templates':
            formattedSettings.emailTemplates = setting.value;
            break;
        }
      });

      return formattedSettings;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingSettings) => {
      setIsLoading(true);
      try {
        // Mettre à jour chaque paramètre individuellement
        const updates = [
          { key: 'time_slots', value: data.timeSlots },
          { key: 'booking_window', value: data.bookingWindow },
          { key: 'discounts', value: data.discounts },
          { key: 'base_price', value: data.basePrice },
          { key: 'closed_days', value: data.closedDays },
          { key: 'email_templates', value: data.emailTemplates }
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
        <FormField
          control={form.control}
          name="timeSlots"
          defaultValue={settings?.timeSlots}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Créneaux horaires disponibles</FormLabel>
              <FormControl>
                <Input {...field} placeholder="17:00, 18:00, 19:00..." />
              </FormControl>
              <FormDescription>
                Entrez les créneaux horaires disponibles, séparés par des virgules
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bookingWindow.startDays"
            defaultValue={settings?.bookingWindow.startDays}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Délai minimum (jours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingWindow.endDays"
            defaultValue={settings?.bookingWindow.endDays}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Délai maximum (jours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice.perHour"
            defaultValue={settings?.basePrice.perHour}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de base par heure (€)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basePrice.perPerson"
            defaultValue={settings?.basePrice.perPerson}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix par personne (€)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="emailTemplates.confirmation.subject"
          defaultValue={settings?.emailTemplates.confirmation.subject}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet de l'email de confirmation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailTemplates.confirmation.paid"
          defaultValue={settings?.emailTemplates.confirmation.paid}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message de confirmation (payé)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailTemplates.confirmation.pending"
          defaultValue={settings?.emailTemplates.confirmation.pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message de confirmation (en attente)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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