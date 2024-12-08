import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { TimeSlots } from "./date-time/TimeSlots";
import { useBookingDates } from "./date-time/useBookingDates";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({});
  const { minDate, maxDate, isDayExcluded, getAvailableSlots } = useBookingDates();

  // Vérifier les réservations existantes
  const checkBookings = async (date: Date) => {
    if (!date) return;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    const slots: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      slots[booking.time_slot] = parseInt(booking.duration);
    });

    setBookedSlots(slots);
  };

  // Mettre à jour les réservations quand la date change
  useEffect(() => {
    if (selectedDate) {
      checkBookings(selectedDate);
    }
  }, [selectedDate]);

  // Mettre à jour les heures disponibles quand le créneau change
  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (selectedDate && timeSlot) {
      const availableSlots = getAvailableSlots(selectedDate);
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
      
      onAvailabilityChange(selectedDate, availableHours);
    }
  }, [form.watch("timeSlot"), selectedDate, bookedSlots]);

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
              onSelect={(date) => {
                field.onChange(date);
                setSelectedDate(date);
              }}
              disabled={(date) => 
                date < minDate || 
                date > maxDate ||
                isDayExcluded(date) ||
                !getAvailableSlots(date).length
              }
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
          availableSlots={getAvailableSlots(selectedDate)}
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