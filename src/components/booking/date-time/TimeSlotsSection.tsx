import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";
import { format, isToday, isBefore, parse } from "date-fns";
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

  // Filtrer les créneaux passés pour aujourd'hui
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
        Math.abs(parseInt(newSelectedSlots[newSelectedSlots.length - 1]) - slotHour) === 1;

      if (isConsecutive && newSelectedSlots.length < 4) {
        newSelectedSlots.push(slot);
        newSelectedSlots.sort();
      }
    } else {
      // Ne permettre la désélection que si c'est le dernier créneau
      if (slotIndex === newSelectedSlots.length - 1) {
        newSelectedSlots.pop();
      }
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

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Sélectionnez vos créneaux horaires</FormLabel>
          <div className="text-sm text-gray-500 mb-2">
            Vous pouvez réserver jusqu'à 4 heures consécutives. Sélectionnez votre heure de début.
          </div>
          <FormControl>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableTimeSlots.map((slot) => {
                const isBlocked = unavailableSlots.has(slot);
                const isSelected = selectedSlots.includes(slot);
                
                // Vérifier si le créneau peut être sélectionné (consécutif au dernier créneau sélectionné)
                const slotHour = parseInt(slot);
                const canBeSelected = selectedSlots.length === 0 || 
                  Math.abs(parseInt(selectedSlots[selectedSlots.length - 1]) - slotHour) === 1;

                // Un créneau ne peut être désélectionné que s'il est le dernier de la sélection
                const canBeDeselected = isSelected && selectedSlots.indexOf(slot) === selectedSlots.length - 1;

                return (
                  <TimeSlot
                    key={slot}
                    slot={slot}
                    isSelected={isSelected}
                    isDisabled={isBlocked || (!isSelected && !canBeSelected && selectedSlots.length > 0) || (isSelected && !canBeDeselected)}
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