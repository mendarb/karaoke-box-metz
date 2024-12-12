import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OpeningHoursSettings } from "./settings/OpeningHoursSettings";
import { BookingWindowSettings } from "./settings/BookingWindowSettings";
import { ExcludedDaysSettings } from "./settings/ExcludedDaysSettings";
import { PricingSettings } from "./settings/PricingSettings";
import { useBookingSettingsForm } from "./hooks/useBookingSettingsForm";

export const BookingSettingsForm = () => {
  const { form, settings, isLoadingSettings, mutation } = useBookingSettingsForm();

  useEffect(() => {
    if (settings) {
      console.log('Resetting form with settings:', settings);
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
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