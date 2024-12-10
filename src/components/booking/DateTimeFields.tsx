import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { format, startOfDay, isEqual } from "date-fns";
import { fr } from "date-fns/locale";
import { TimeSlots } from "./date-time/TimeSlots";
import { useBookingDates } from "./date-time/useBookingDates";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const { minDate, maxDate, isDayExcluded, getAvailableSlots } = useBookingDates();

  // Mettre à jour les créneaux disponibles pour une date donnée
  const updateAvailableSlots = async (date: Date) => {
    try {
      console.log('Updating slots for date:', date);
      const slots = await getAvailableSlots(date);
      console.log('Available slots:', slots);
      setAvailableSlots(slots);
      return slots;
    } catch (error) {
      console.error('Error updating slots:', error);
      setAvailableSlots([]);
      return [];
    }
  };

  // Mettre à jour les heures disponibles quand le créneau change
  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (selectedDate && timeSlot && availableSlots.length > 0) {
      console.log('Calculating available hours for slot:', timeSlot);
      const slotIndex = availableSlots.indexOf(timeSlot);
      let availableHours = 0;
      
      for (let i = slotIndex; i < availableSlots.length - 1; i++) {
        const currentSlot = availableSlots[i];
        const nextSlot = availableSlots[i + 1];
        
        const currentHour = parseInt(currentSlot.split(':')[0]);
        const nextHour = parseInt(nextSlot.split(':')[0]);
        
        if (nextHour - currentHour === 1 && !bookedSlots[nextSlot]) {
          availableHours++;
        } else {
          break;
        }
      }
      
      console.log('Available hours calculated:', availableHours);
      onAvailabilityChange(selectedDate, availableHours);
    }
  }, [form.watch("timeSlot"), selectedDate, bookedSlots, availableSlots]);

  // Calculer les dates désactivées une seule fois au chargement
  useEffect(() => {
    const calculateDisabledDates = async () => {
      setIsLoadingDates(true);
      try {
        const today = startOfDay(new Date());
        const endDate = startOfDay(new Date());
        endDate.setMonth(endDate.getMonth() + 2);
        
        const disabledDates: Date[] = [];
        let currentDate = startOfDay(new Date(today));
        
        while (currentDate <= endDate) {
          if (
            currentDate < minDate || 
            currentDate > maxDate ||
            isDayExcluded(currentDate)
          ) {
            disabledDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setDisabledDates(disabledDates);
      } catch (error) {
        console.error('Error calculating disabled dates:', error);
      } finally {
        setIsLoadingDates(false);
      }
    };
    
    calculateDisabledDates();
  }, [minDate, maxDate]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="date"
        rules={{ required: "La date est requise" }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date *</FormLabel>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={async (date) => {
                if (date) {
                  console.log('Date selected:', date);
                  const normalizedDate = startOfDay(date);
                  field.onChange(normalizedDate);
                  setSelectedDate(normalizedDate);
                  await updateAvailableSlots(normalizedDate);
                }
              }}
              disabled={(date) => {
                const normalizedDate = startOfDay(date);
                return disabledDates.some(disabledDate => 
                  isEqual(startOfDay(disabledDate), normalizedDate)
                );
              }}
              initialFocus
              locale={fr}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <TimeSlots
          form={form}
          availableSlots={availableSlots}
          bookedSlots={bookedSlots}
        />
      )}

      {selectedDate && (
        <p className="text-sm text-gray-500 mt-2">
          Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      )}
    </div>
  );
};