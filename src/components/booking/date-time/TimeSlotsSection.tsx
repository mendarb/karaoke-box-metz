import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";
import { format } from "date-fns";
import { useState, useEffect } from "react";

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
    // Reset selected slots when date changes
    setSelectedSlots([]);
    form.setValue("timeSlot", "");
    form.setValue("duration", "");
  }, [selectedDate]);

  if (isLoading || isLoadingBookings) {
    return <LoadingSkeleton />;
  }

  const { slots, blockedSlots } = availableSlots;

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  // Créer un Set des créneaux indisponibles
  const unavailableSlots = new Set<string>();

  // Ajouter les créneaux bloqués
  blockedSlots.forEach(slot => unavailableSlots.add(slot));

  // Ajouter les créneaux réservés
  bookings.forEach(booking => {
    const startHour = parseInt(booking.time_slot);
    const duration = parseInt(booking.duration);
    
    // Marquer tous les créneaux couverts par la réservation comme indisponibles
    for (let hour = startHour; hour < startHour + duration; hour++) {
      unavailableSlots.add(`${hour.toString().padStart(2, '0')}:00`);
    }
  });

  const handleSlotSelection = (slot: string) => {
    const newSelectedSlots = [...selectedSlots];
    const slotIndex = newSelectedSlots.indexOf(slot);
    
    if (slotIndex === -1) {
      // Ajouter le nouveau créneau seulement s'il est consécutif et dans la limite de 4h
      const slotHour = parseInt(slot);
      const isConsecutive = newSelectedSlots.length === 0 || 
        newSelectedSlots.some(existingSlot => {
          const existingHour = parseInt(existingSlot);
          return Math.abs(existingHour - slotHour) === 1;
        });

      if (isConsecutive && newSelectedSlots.length < 4) {
        newSelectedSlots.push(slot);
        newSelectedSlots.sort();
      }
    } else {
      // Retirer le créneau
      newSelectedSlots.splice(slotIndex, 1);
    }

    // Mettre à jour les créneaux sélectionnés
    setSelectedSlots(newSelectedSlots);

    // Mettre à jour le formulaire
    if (newSelectedSlots.length > 0) {
      const firstSlot = newSelectedSlots.sort()[0];
      form.setValue("timeSlot", firstSlot);
      form.setValue("duration", newSelectedSlots.length.toString());
    } else {
      form.setValue("timeSlot", "");
      form.setValue("duration", "");
    }
  };

  console.log('🔍 Créneaux indisponibles:', {
    date: format(selectedDate, 'yyyy-MM-dd'),
    unavailableSlots: Array.from(unavailableSlots)
  });

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Sélectionnez vos créneaux (jusqu'à 4h consécutives)</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isBlocked = unavailableSlots.has(slot);
                const isSelected = selectedSlots.includes(slot);
                
                // Vérifier si le créneau peut être sélectionné (consécutif aux créneaux déjà sélectionnés)
                const slotHour = parseInt(slot);
                const canBeSelected = selectedSlots.length === 0 || 
                  selectedSlots.some(selectedSlot => {
                    const selectedHour = parseInt(selectedSlot);
                    return Math.abs(selectedHour - slotHour) === 1;
                  });

                return (
                  <TimeSlot
                    key={slot}
                    slot={slot}
                    isSelected={isSelected}
                    isDisabled={isBlocked || (!isSelected && !canBeSelected && selectedSlots.length > 0)}
                    onSelect={() => handleSlotSelection(slot)}
                    date={selectedDate}
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