import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";

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
  const [disabledSlots, setDisabledSlots] = useState<string[]>([]);
  const { checkOverlap } = useBookingOverlap();
  const { watch } = useFormContext();
  const selectedDate = watch("date");
  const duration = watch("duration");

  useEffect(() => {
    const checkSlots = async () => {
      if (!selectedDate || !duration) return;

      const disabledTimeSlots = [];
      for (const slot of availableSlots) {
        const isOverlapping = await checkOverlap(selectedDate, slot, duration);
        if (isOverlapping) {
          disabledTimeSlots.push(slot);
        }
      }
      setDisabledSlots(disabledTimeSlots);
    };

    checkSlots();
  }, [selectedDate, duration, availableSlots, checkOverlap]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Choisissez votre horaire</h3>
      <TimeSlots
        form={form}
        availableSlots={availableSlots}
        disabledSlots={disabledSlots}
        isLoading={isLoading}
      />
    </div>
  );
};