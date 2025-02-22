import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";
import { format, isToday, isBefore, parse } from "date-fns";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  availableSlots: { slots: string[], blockedSlots: Set<string> };
  isLoading: boolean;
}

export const TimeSlotsSection = ({ form, availableSlots, isLoading }: TimeSlotsSectionProps) => {
  const selectedDate = form.watch("date");
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookedSlots(selectedDate);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSlots([]);
    form.setValue("timeSlot", "");
    form.setValue("duration", "");
  }, [selectedDate]);

  if (isLoading || isLoadingBookings) {
    return <LoadingSkeleton />;
  }

  const { slots, blockedSlots } = availableSlots;

  const filterPassedSlots = (slots: string[]) => {
    if (!isToday(selectedDate)) {
      return slots;
    }

    const now = new Date();
    const currentHour = now.getHours();
    
    return slots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour > currentHour;
    });
  };

  const availableTimeSlots = filterPassedSlots(slots);

  if (!availableTimeSlots || availableTimeSlots.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  const unavailableSlots = new Set<string>();
  blockedSlots.forEach(slot => unavailableSlots.add(slot));
  bookings.forEach(booking => {
    const startHour = parseInt(booking.time_slot);
    const duration = parseInt(booking.duration);
    for (let hour = startHour; hour < startHour + duration; hour++) {
      unavailableSlots.add(`${hour.toString().padStart(2, '0')}:00`);
    }
  });

  const handleSlotSelection = (slot: string) => {
    const newSelectedSlots = [...selectedSlots];
    const slotIndex = newSelectedSlots.indexOf(slot);
    
    if (slotIndex === -1) {
      const slotHour = parseInt(slot);
      const isConsecutive = newSelectedSlots.length === 0 || 
        Math.abs(parseInt(newSelectedSlots[newSelectedSlots.length - 1]) - slotHour) === 1;

      if (isConsecutive && newSelectedSlots.length < 4) {
        newSelectedSlots.push(slot);
        newSelectedSlots.sort();
      }
    } else {
      if (slotIndex === newSelectedSlots.length - 1) {
        newSelectedSlots.pop();
      }
    }

    setSelectedSlots(newSelectedSlots);

    if (newSelectedSlots.length > 0) {
      const firstSlot = newSelectedSlots.sort()[0];
      form.setValue("timeSlot", firstSlot);
      // Set duration based on number of selected slots
      form.setValue("duration", newSelectedSlots.length.toString());
      
      console.log('🕒 Durée calculée:', {
        selectedSlots: newSelectedSlots,
        duration: newSelectedSlots.length,
        startTime: firstSlot
      });
    } else {
      form.setValue("timeSlot", "");
      form.setValue("duration", "");
    }
  };

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Sélectionnez vos créneaux horaires</FormLabel>
          
          <Alert className="bg-violet-50 border-violet-200 mb-4">
            <Info className="h-4 w-4 text-violet-600" />
            <AlertDescription className="text-sm text-violet-800">
              Sélectionnez votre heure de début. Vous pouvez réserver jusqu'à 4 heures consécutives en cliquant sur les créneaux qui suivent.
              {selectedSlots.length > 0 && (
                <div className="mt-2 font-medium">
                  Durée sélectionnée : {selectedSlots.length} heure{selectedSlots.length > 1 ? 's' : ''}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <FormControl>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableTimeSlots.map((slot) => {
                const isBlocked = unavailableSlots.has(slot);
                const isSelected = selectedSlots.includes(slot);
                const slotHour = parseInt(slot);
                const canBeSelected = selectedSlots.length === 0 || 
                  Math.abs(parseInt(selectedSlots[selectedSlots.length - 1]) - slotHour) === 1;
                const canBeDeselected = isSelected && selectedSlots.indexOf(slot) === selectedSlots.length - 1;

                return (
                  <TimeSlot
                    key={slot}
                    slot={slot}
                    isSelected={isSelected}
                    isDisabled={isBlocked || (!isSelected && !canBeSelected && selectedSlots.length > 0) || (isSelected && !canBeDeselected)}
                    onSelect={() => handleSlotSelection(slot)}
                    date={selectedDate}
                    selectedSlots={selectedSlots}
                  />
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};