import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { PriceCalculator } from "./PriceCalculator";
import { PersonalInfoFields } from "./booking/PersonalInfoFields";
import { DateTimeFields } from "./booking/DateTimeFields";
import { GroupSizeAndDurationFields } from "./booking/GroupSizeAndDurationFields";
import { AdditionalFields } from "./booking/AdditionalFields";

export const BookingForm = () => {
  const { toast } = useToast();
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Réservation envoyée !",
      description: "Nous vous contacterons sous 24 heures pour confirmer votre créneau.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
        <PersonalInfoFields form={form} />
        <DateTimeFields form={form} />
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={setGroupSize}
          onDurationChange={setDuration}
        />
        <AdditionalFields form={form} />

        {groupSize && duration && (
          <PriceCalculator groupSize={groupSize} duration={duration} />
        )}

        <Button
          type="submit"
          className="w-full bg-karaoke-primary hover:bg-karaoke-accent transition-colors"
        >
          Réserver ma cabine
        </Button>
      </form>
    </Form>
  );
};