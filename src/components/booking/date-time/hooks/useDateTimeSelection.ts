import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useBookingDates } from "./useBookingDates";

export const useDateTimeSelection = (
  form: UseFormReturn<any>,
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void
) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { getAvailableSlots, getAvailableHoursForSlot } = useBookingDates();

  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    form.setValue("date", date);
    form.setValue("timeSlot", "");
    
    const slots = await getAvailableSlots(date);
    setAvailableSlots(slots);
    onAvailabilityChange(date, 0);
  }, [form, getAvailableSlots, onAvailabilityChange]);

  const handleTimeSlotChange = useCallback(async (timeSlot: string) => {
    if (!selectedDate || !timeSlot) {
      onAvailabilityChange(selectedDate, 0);
      return;
    }

    const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot);
    onAvailabilityChange(selectedDate, availableHours);
  }, [selectedDate, getAvailableHoursForSlot, onAvailabilityChange]);

  return {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  };
};