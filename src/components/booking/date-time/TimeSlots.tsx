import { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: { slots: string[]; blockedSlots: Set<string> };
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

  // Créer un Set des créneaux indisponibles
  const unavailableSlots = useMemo(() => {
    const slots = new Set<string>();
    
    // Ajouter les créneaux bloqués
    availableSlots.blockedSlots.forEach(slot => slots.add(slot));
    
    // Ajouter les créneaux réservés
    bookedSlots.forEach(booking => {
      const startHour = parseInt(booking.time_slot);
      const duration = parseInt(booking.duration);
      
      // Marquer tous les créneaux couverts par la réservation comme indisponibles
      for (let hour = startHour; hour < startHour + duration; hour++) {
        slots.add(`${hour.toString().padStart(2, '0')}:00`);
      }
    });
    
    return slots;
  }, [availableSlots.blockedSlots, bookedSlots]);

  const sortedSlots = useMemo(() => {
    return [...availableSlots.slots].sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      return hourA - hourB;
    });
  }, [availableSlots.slots]);

  if (isLoadingSlots || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4 sm:px-0">
      {sortedSlots.map((slot) => {
        const isDisabled = unavailableSlots.has(slot);
        
        return (
          <TimeSlot
            key={slot}
            slot={slot}
            isSelected={selectedTimeSlot === slot}
            isDisabled={isDisabled}
            onSelect={(slot) => {
              if (!isDisabled) {
                form.setValue("timeSlot", slot);
              }
            }}
            date={selectedDate}
          />
        );
      })}
    </div>
  );
};