import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { OpeningHoursSettings } from "./settings/OpeningHoursSettings";
import { BookingWindowSettings } from "./settings/BookingWindowSettings";
import { ExcludedDaysSettings } from "./settings/ExcludedDaysSettings";
import { PricingSettings } from "./settings/PricingSettings";
import { useBookingSettingsForm } from "./hooks/useBookingSettingsForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export const BookingSettingsForm = () => {
  const { form, isLoading, onSubmit } = useBookingSettingsForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6 p-1">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Tarification</h3>
                <p className="text-sm text-muted-foreground">
                  Configurez les prix de base par heure et par personne
                </p>
                <PricingSettings form={form} />
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Fenêtre de réservation</h3>
                <p className="text-sm text-muted-foreground">
                  Définissez la période pendant laquelle les clients peuvent réserver
                </p>
                <BookingWindowSettings form={form} />
              </Card>
            </div>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
              <p className="text-sm text-muted-foreground">
                Gérez les horaires d'ouverture pour chaque jour de la semaine
              </p>
              <OpeningHoursSettings form={form} />
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Jours exclus</h3>
              <p className="text-sm text-muted-foreground">
                Définissez les jours où les réservations ne sont pas possibles
              </p>
              <ExcludedDaysSettings form={form} />
            </Card>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 flex justify-end py-4 px-6 bg-background/80 backdrop-blur-sm border-t">
          <Button
            type="submit"
            className="gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  );
};