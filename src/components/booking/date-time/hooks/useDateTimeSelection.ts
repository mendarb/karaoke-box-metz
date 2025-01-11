import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { startOfDay } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { getAvailableSlots } from "../utils/slotUtils";
import { getAvailableHoursForSlot } from "../utils/availabilityUtils";

export const useDateTimeSelection = (
  form: UseFormReturn<any>,
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void
) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { settings } = useBookingSettings();

  const handleDateSelect = useCallback(async (date: Date) => {
    const normalizedDate = startOfDay(date);
    setSelectedDate(normalizedDate);
    form.setValue("date", normalizedDate);
    form.setValue("timeSlot", "");
    
    const slots = await getAvailableSlots(normalizedDate, settings);
    setAvailableSlots(slots);
    onAvailabilityChange(normalizedDate, 0);
  }, [form, settings, onAvailabilityChange]);

  const handleTimeSlotChange = useCallback(async (timeSlot: string) => {
    if (!selectedDate || !timeSlot) {
      onAvailabilityChange(selectedDate, 0);
      return;
    }

    const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot, settings);
    onAvailabilityChange(selectedDate, availableHours);
  }, [selectedDate, settings, onAvailabilityChange]);

  return {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  };
};