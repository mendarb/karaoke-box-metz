import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useBookingDates } from "./useBookingDates";

export const useDateTimeSelection = (
  form: UseFormReturn<any>,
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void
) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { getAvailableSlots, getAvailableHoursForSlot } = useBookingDates();

  const handleDateSelect = async (date: Date) => {
    try {
      console.log('🗓️ Date sélectionnée:', date);
      setSelectedDate(date);
      form.setValue("date", date);
      form.setValue("timeSlot", "");
      
      const slots = await getAvailableSlots(date);
      console.log('📅 Créneaux disponibles:', slots);
      
      setAvailableSlots(slots);
      onAvailabilityChange(date, 0);
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error);
      setAvailableSlots([]);
    }
  };

  const handleTimeSlotChange = async (timeSlot: string) => {
    if (!selectedDate || !timeSlot) {
      onAvailabilityChange(selectedDate, 0);
      return;
    }

    try {
      const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot);
      console.log(`⏰ Heures disponibles pour ${timeSlot}:`, availableHours);
      onAvailabilityChange(selectedDate, availableHours);
    } catch (error) {
      console.error('❌ Erreur calcul heures disponibles:', error);
      onAvailabilityChange(selectedDate, 0);
    }
  };

  return {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  };
};