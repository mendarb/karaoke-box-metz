import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { startOfDay } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { getAvailableSlots } from "../utils/slotUtils";
import { getAvailableHoursForSlot } from "../utils/availabilityUtils";

export const useDateTimeSelection = (
  form: UseFormReturn<any>,
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void,
  requiredDuration: number = 1
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
    // Filter slots that have enough available hours
    const availableSlots = await Promise.all(
      slots.map(async (slot) => {
        const availableHours = await getAvailableHoursForSlot(normalizedDate, slot, settings);
        return { slot, availableHours };
      })
    );
    
    const filteredSlots = availableSlots
      .filter(({ availableHours }) => availableHours >= requiredDuration)
      .map(({ slot }) => slot);

    setAvailableSlots(filteredSlots);
    onAvailabilityChange(normalizedDate, 0);
  }, [form, settings, onAvailabilityChange, requiredDuration]);

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