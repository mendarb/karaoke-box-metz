import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const timeSlots = [
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({}); // Stocke la durée réservée pour chaque créneau

  // Date minimum : aujourd'hui
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const isMonday = (date: Date) => {
    return date.getDay() === 1; // 1 représente Lundi
  };

  // Fonction pour vérifier les réservations existantes
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
      const startTime = booking.time_slot;
      const duration = parseInt(booking.duration);
      slots[startTime] = duration;
    });

    setBookedSlots(slots);
  };

  // Vérifier si un créneau est disponible
  const isSlotAvailable = (slot: string) => {
    // Si le créneau est directement réservé
    if (slot in bookedSlots) return false;

    // Vérifier les chevauchements avec les créneaux réservés
    const slotTime = parseInt(slot.split(':')[0]) * 60 + parseInt(slot.split(':')[1]);
    
    for (const [bookedSlot, duration] of Object.entries(bookedSlots)) {
      const bookedTime = parseInt(bookedSlot.split(':')[0]) * 60 + parseInt(bookedSlot.split(':')[1]);
      const bookedEndTime = bookedTime + duration * 60;
      
      // Si le créneau actuel est pendant une réservation existante
      if (slotTime >= bookedTime && slotTime < bookedEndTime) {
        return false;
      }
    }

    return true;
  };

  // Mettre à jour les réservations quand la date change
  useEffect(() => {
    if (selectedDate) {
      checkBookings(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="date"
        rules={{ required: "La date est requise" }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date *</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={(date) => 
                  date < minDate || 
                  isMonday(date)
                }
                initialFocus
                locale={fr}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timeSlot"
        rules={{ required: "L'heure est requise" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heure *</FormLabel>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <TooltipProvider>
                {timeSlots.map((slot) => {
                  const isAvailable = isSlotAvailable(slot);
                  return (
                    <Tooltip key={slot}>
                      <TooltipTrigger asChild>
                        <div>
                          <FormControl>
                            <Button
                              type="button"
                              variant={field.value === slot ? "default" : "outline"}
                              className={`w-full ${
                                field.value === slot
                                  ? "bg-violet-600 hover:bg-violet-700"
                                  : ""
                              } ${
                                !isAvailable
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => isAvailable && field.onChange(slot)}
                              disabled={!selectedDate || !isAvailable}
                            >
                              {slot}
                            </Button>
                          </FormControl>
                        </div>
                      </TooltipTrigger>
                      {!isAvailable && (
                        <TooltipContent>
                          <p>Créneau déjà réservé</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <p className="text-sm text-gray-500 mt-2">
          Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      )}
    </div>
  );
};