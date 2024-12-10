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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { minDate, maxDate, isDayExcluded, getAvailableSlots } = useBookingDates();

  // Vérifier les réservations existantes
  const checkBookings = async (date: Date) => {
    if (!date) return;

    console.log('Checking bookings for date:', date);
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled');

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    console.log('Found bookings:', bookings);
    const slots: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      slots[booking.time_slot] = parseInt(booking.duration);
    });

    console.log('Setting booked slots:', slots);
    setBookedSlots(slots);
  };

  // Mettre à jour les réservations et les créneaux disponibles quand la date change
  useEffect(() => {
    const updateDateInfo = async () => {
      if (selectedDate) {
        await checkBookings(selectedDate);
        const slots = await getAvailableSlots(selectedDate);
        console.log('Setting available slots:', slots);
        setAvailableSlots(slots);
      }
    };
    updateDateInfo();
  }, [selectedDate]);

  // Mettre à jour les heures disponibles quand le créneau change
  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (selectedDate && timeSlot) {
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

  // Pre-calculate disabled dates
  useEffect(() => {
    const calculateDisabledDates = async () => {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2); // Look ahead 2 months
      
      const disabledDates: Date[] = [];
      let currentDate = new Date(today);
      
      while (currentDate <= endDate) {
        const slots = await getAvailableSlots(currentDate);
        if (
          currentDate < minDate || 
          currentDate > maxDate ||
          isDayExcluded(currentDate) ||
          !slots.length
        ) {
          disabledDates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setDisabledDates(disabledDates);
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
              onSelect={(date) => {
                console.log('Date selected:', date);
                field.onChange(date);
                setSelectedDate(date);
              }}
              disabled={(date) => {
                return disabledDates.some(
                  disabledDate => 
                    disabledDate.getFullYear() === date.getFullYear() &&
                    disabledDate.getMonth() === date.getMonth() &&
                    disabledDate.getDate() === date.getDate()
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