import { useState, useEffect } from "react";
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
  }, [form.watch("timeSlot"), selectedDate, availableSlots, getAvailableHoursForSlot, onAvailabilityChange]);

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