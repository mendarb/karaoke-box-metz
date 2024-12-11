import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlots } from "./date-time/TimeSlots";
import { useBookingDates } from "./date-time/useBookingDates";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { BookingCalendar } from "./date-time/BookingCalendar";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { minDate, maxDate, isDayExcluded, getAvailableSlots } = useBookingDates();
  const { disabledDates } = useDisabledDates({ minDate, maxDate, isDayExcluded });

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    const slots = await getAvailableSlots(date);
    setAvailableSlots(slots);
    console.log('Available slots updated:', slots);
  };

  const handleTimeSlotChange = () => {
    const timeSlot = form.watch("timeSlot");
    if (!selectedDate || !timeSlot || availableSlots.length === 0) return;

    const slotIndex = availableSlots.indexOf(timeSlot);
    if (slotIndex === -1) return;

    // Vérifier si c'est le dernier créneau disponible de la journée
    const isLastSlot = slotIndex === availableSlots.length - 1;
    
    if (isLastSlot) {
      console.log('Dernier créneau sélectionné (21h), limitation à 1h');
      onAvailabilityChange(selectedDate, 1);
      return;
    }

    // Pour les autres créneaux, calculer les heures disponibles
    const currentHour = parseInt(timeSlot.split(':')[0]);
    let availableHours = 1;

    // Vérifier les créneaux suivants
    for (let i = slotIndex + 1; i < availableSlots.length && availableHours < 4; i++) {
      const nextSlot = availableSlots[i];
      const nextHour = parseInt(nextSlot.split(':')[0]);

      // Vérifier si le créneau suivant est consécutif
      if (nextHour === currentHour + availableHours) {
        availableHours++;
      } else {
        break;
      }
    }

    console.log(`Heures disponibles pour ${timeSlot}:`, availableHours);
    onAvailabilityChange(selectedDate, availableHours);
  };

  // Surveiller les changements de créneau horaire
  form.watch("timeSlot", handleTimeSlotChange);

  return (
    <div className="space-y-6">
      <BookingCalendar
        form={form}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {selectedDate && (
        <TimeSlots
          form={form}
          availableSlots={availableSlots}
          bookedSlots={bookedSlots}
        />
      )}
    </div>
  );
};