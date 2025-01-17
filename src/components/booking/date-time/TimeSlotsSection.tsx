import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";
import { useBookedSlots } from "./time-slots/useBookedSlots";
import { format } from "date-fns";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  availableSlots: { slots: string[], blockedSlots: Set<string> };
  isLoading: boolean;
}

export const TimeSlotsSection = ({ form, availableSlots, isLoading }: TimeSlotsSectionProps) => {
  const selectedDate = form.watch("date");
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookedSlots(selectedDate);

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
          <FormLabel>Heure d'arrivée</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {slots.map((slot) => {
                const isBlocked = unavailableSlots.has(slot);
                return (
                  <TimeSlot
                    key={slot}
                    slot={slot}
                    isSelected={field.value === slot}
                    isDisabled={isBlocked}
                    onSelect={(slot) => {
                      if (!isBlocked) {
                        field.onChange(slot);
                      }
                    }}
                    date={selectedDate}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};