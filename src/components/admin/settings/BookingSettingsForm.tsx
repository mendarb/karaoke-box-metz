import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { OpeningHoursSettings } from "./settings/OpeningHoursSettings";
import { BookingWindowSettings } from "./settings/BookingWindowSettings";
import { ExcludedDaysSettings } from "./settings/ExcludedDaysSettings";
import { PricingSettings } from "./settings/PricingSettings";
import { useBookingSettingsForm } from "./hooks/useBookingSettingsForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <div className="grid gap-6 md:grid-cols-2">
              <PricingSettings form={form} />
              <BookingWindowSettings form={form} />
            </div>

            <OpeningHoursSettings form={form} />
            <ExcludedDaysSettings form={form} />
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 flex justify-end py-4 bg-background/80 backdrop-blur-sm border-t">
          <Button
            type="submit"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  );
};