import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useBookingDates } from "./useBookingDates";
import { toast } from "@/hooks/use-toast";

export const useDateTimeSelection = (
  form: UseFormReturn<any>,
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void
) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { settings, minDate, maxDate, isDayExcluded, getAvailableSlots, getAvailableHoursForSlot } = useBookingDates();

  const handleDateSelect = async (date: Date) => {
    try {
      console.log('🗓️ Date selected:', date);
      setSelectedDate(date);
      form.setValue("timeSlot", "");
      
      const slots = await getAvailableSlots(date);
      console.log('📅 Available slots:', slots);
      
      if (slots.length === 0) {
        toast({
          title: "Aucun créneau disponible",
          description: "Il n'y a pas de créneaux disponibles pour cette date",
          variant: "destructive",
        });
      }
      
      setAvailableSlots(slots);
      onAvailabilityChange(date, 0);
    } catch (error) {
      console.error('❌ Error fetching available slots:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les créneaux disponibles",
        variant: "destructive",
      });
    }
  };

  const handleTimeSlotChange = async (timeSlot: string) => {
    if (!selectedDate || !timeSlot) {
      onAvailabilityChange(selectedDate, 0);
      return;
    }

    try {
      const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot);
      console.log(`⏰ Available hours for ${timeSlot}:`, availableHours);
      onAvailabilityChange(selectedDate, availableHours);
    } catch (error) {
      console.error('❌ Error calculating available hours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer les heures disponibles",
        variant: "destructive",
      });
      onAvailabilityChange(selectedDate, 0);
    }
  };

  return {
    selectedDate,
    availableSlots,
    minDate,
    maxDate,
    isDayExcluded,
    handleDateSelect,
    handleTimeSlotChange
  };
};