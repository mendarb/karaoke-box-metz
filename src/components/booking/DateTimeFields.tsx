import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlots } from "./date-time/TimeSlots";
import { useBookingDates } from "./date-time/hooks/useBookingDates";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { BookingCalendar } from "./date-time/BookingCalendar";
import { toast } from "@/components/ui/use-toast";

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
    try {
      setSelectedDate(date);
      // Réinitialiser le créneau horaire sélectionné
      form.setValue("timeSlot", "");
      const slots = await getAvailableSlots(date);
      
      if (slots.length === 0) {
        toast({
          title: "Aucun créneau disponible",
          description: "Il n'y a pas de créneaux disponibles pour cette date",
          variant: "destructive",
        });
      }
      
      setAvailableSlots(slots);
      console.log('Available slots updated:', slots);
      // Réinitialiser les heures disponibles
      onAvailabilityChange(date, 0);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les créneaux disponibles",
        variant: "destructive",
      });
    }
  };

  // Gérer le changement de créneau horaire
  useEffect(() => {
    const updateAvailableHours = async () => {
      const timeSlot = form.watch("timeSlot");
      if (!selectedDate || !timeSlot || availableSlots.length === 0) {
        onAvailabilityChange(selectedDate, 0);
        return;
      }

      try {
        const availableHours = await getAvailableHoursForSlot(selectedDate, timeSlot);
        console.log(`Available hours for ${timeSlot}:`, availableHours);
        onAvailabilityChange(selectedDate, availableHours);
      } catch (error) {
        console.error('Error calculating available hours:', error);
        toast({
          title: "Erreur",
          description: "Impossible de calculer les heures disponibles",
          variant: "destructive",
        });
      }
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