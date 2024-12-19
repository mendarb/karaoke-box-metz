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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <PricingSettings form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <BookingWindowSettings form={form} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <OpeningHoursSettings form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ExcludedDaysSettings form={form} />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
        >
          Sauvegarder les modifications
        </Button>
      </form>
    </Form>
  );
};