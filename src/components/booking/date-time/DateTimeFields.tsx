import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";
import { useBookingDates } from "./hooks/useBookingDates";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { BookingCalendar } from "./BookingCalendar";
import { toast } from "@/hooks/use-toast";
import { useBookingSettings } from "./hooks/useBookingSettings";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <BookingCalendar
            form={form}
            disabledDates={disabledDates}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <TimeSlots
              form={form}
              availableSlots={availableSlots}
              isLoading={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};