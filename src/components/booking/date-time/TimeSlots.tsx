import { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  isLoading: boolean;
  selectedDate: Date;
}

export const TimeSlots = ({
  form,
  availableSlots,
  isLoading,
  selectedDate
}: TimeSlotsProps) => {
  const selectedTimeSlot = form.watch("timeSlot");
  const { data: disabledSlots = [], isLoading: isLoadingSlots } = useBookedSlots(selectedDate);

  const sortedSlots = useMemo(() => {
    return [...availableSlots].sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      return hourA - hourB;
    });
  }, [availableSlots]);

  if (isLoadingSlots || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4 sm:px-0">
      {sortedSlots.map((slot) => (
        <TimeSlot
          key={slot}
          slot={slot}
          isSelected={selectedTimeSlot === slot}
          isDisabled={disabledSlots.includes(slot)}
          onSelect={(slot) => form.setValue("timeSlot", slot)}
          date={selectedDate}
        />
      ))}
    </div>
  );
};