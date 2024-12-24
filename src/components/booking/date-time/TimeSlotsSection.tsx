import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
import { supabase } from "@/lib/supabase";

interface TimeSlotsSectionProps {
  form: any;
  availableSlots: string[];
  isLoading: boolean;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading,
}: TimeSlotsSectionProps) => {
  const { watch } = useFormContext();
  const selectedDate = watch("date");

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Choisissez votre horaire</h3>
      <TimeSlots
        form={form}
        availableSlots={availableSlots}
        isLoading={isLoading}
        selectedDate={selectedDate}
      />
    </div>
  );
};