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
  };

  // Mettre à jour les heures disponibles quand le créneau change
  const handleTimeSlotChange = () => {
    const timeSlot = form.watch("timeSlot");
    if (selectedDate && timeSlot && availableSlots.length > 0) {
      const slotIndex = availableSlots.indexOf(timeSlot);
      let availableHours = 0;
      
      // Vérifier si c'est le dernier créneau de la journée
      const isLastSlot = slotIndex === availableSlots.length - 1;
      
      if (isLastSlot) {
        // Si c'est le dernier créneau, on ne peut réserver que pour 1h
        availableHours = 1;
        console.log('Dernier créneau sélectionné, limitation à 1h');
      } else {
        // Sinon, on compte les créneaux consécutifs disponibles
        // en commençant par 1 pour le créneau actuel
        availableHours = 1;
        
        // On vérifie les créneaux suivants
        for (let i = slotIndex + 1; i < availableSlots.length && availableHours < 4; i++) {
          const currentSlot = availableSlots[i - 1];
          const nextSlot = availableSlots[i];
          
          const currentHour = parseInt(currentSlot.split(':')[0]);
          const nextHour = parseInt(nextSlot.split(':')[0]);
          
          if (nextHour - currentHour === 1 && !bookedSlots[nextSlot]) {
            availableHours++;
          } else {
            break;
          }
        }
      }
      
      console.log('Available hours for slot', timeSlot, ':', availableHours);
      onAvailabilityChange(selectedDate, availableHours);
    }
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