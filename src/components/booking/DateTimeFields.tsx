import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlots } from "./date-time/TimeSlots";
import { useBookingDates } from "./date-time/hooks/useBookingDates";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { BookingCalendar } from "./date-time/BookingCalendar";
import { toast } from "@/hooks/use-toast";
import { useBookingSettings } from "./date-time/hooks/useBookingSettings";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { settings, minDate, maxDate } = useBookingSettings();
  
  const { isDayExcluded, getAvailableSlots, getAvailableHoursForSlot } = useBookingDates();
  const { disabledDates } = useDisabledDates({ minDate, maxDate, isDayExcluded });

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

  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [form.watch("timeSlot")]);

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

  return (
    <div className="space-y-8">
      <div className="w-full max-w-[600px] mx-auto">
        <BookingCalendar
          disabledDates={disabledDates}
          onSelect={handleDateSelect}
          selectedDate={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>

      {selectedDate && (
        <div className="mt-8">
          <TimeSlots
            form={form}
            availableSlots={availableSlots}
            isLoading={false}
          />
        </div>
      )}
    </div>
  );
};