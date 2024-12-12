import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";
import { useBookingDates } from "./hooks/useBookingDates";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { BookingCalendar } from "./BookingCalendar";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const { minDate, maxDate, isDayExcluded, getAvailableSlots, getAvailableHoursForSlot } = useBookingDates();
  const { disabledDates } = useDisabledDates({ minDate, maxDate, isDayExcluded });

  // Gérer le changement de date
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    // Réinitialiser le créneau horaire sélectionné
    form.setValue("timeSlot", "");
    const slots = await getAvailableSlots(date);
    setAvailableSlots(slots);
    console.log('Available slots updated:', slots);
    // Réinitialiser les heures disponibles
    onAvailabilityChange(date, 0);
  };

  // Gérer le changement de créneau horaire
  useEffect(() => {
    const updateAvailableHours = async () => {
      const timeSlot = form.watch("timeSlot");
      if (!selectedDate || !timeSlot || availableSlots.length === 0) {
        onAvailabilityChange(selectedDate, 0);
        return;
      }

      const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot);
      console.log(`Available hours for ${timeSlot}:`, availableHours);
      onAvailabilityChange(selectedDate, availableHours);
    };

    updateAvailableHours();
  }, [form.watch("timeSlot"), selectedDate, availableSlots]);

  return (
    <div className="space-y-6">
      <BookingCalendar
        form={form}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
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