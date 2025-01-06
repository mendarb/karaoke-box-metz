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
  const { data: bookedSlots = [], isLoading: isLoadingSlots } = useBookedSlots(selectedDate);

  // Convert booked slots to a Set of unavailable time slots
  const disabledSlots = useMemo(() => {
    const slots = new Set<string>();
    bookedSlots.forEach(booking => {
      const startHour = parseInt(booking.timeSlot);
      const duration = parseInt(booking.duration);
      
      // Add all hours covered by this booking
      for (let hour = startHour; hour < startHour + duration; hour++) {
        slots.add(`${hour.toString().padStart(2, '0')}:00`);
      }
    });
    return Array.from(slots);
  }, [bookedSlots]);

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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {sortedSlots.map((slot) => (
        <TimeSlot
          key={slot}
          slot={slot}
          isSelected={selectedTimeSlot === slot}
          isDisabled={disabledSlots.includes(slot)}
          onSelect={(slot) => form.setValue("timeSlot", slot)}
        />
      ))}
    </div>
  );
};