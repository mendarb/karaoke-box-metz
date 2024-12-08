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
import { useQuery } from "@tanstack/react-query";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({}); // Stocke la durée réservée pour chaque créneau

  // Récupérer les paramètres de réservation
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*');

      if (error) throw error;

      const formattedSettings = {
        bookingWindow: { startDays: 1, endDays: 60 },
        openingHours: {},
        excludedDays: [],
      };

      data?.forEach(setting => {
        switch (setting.key) {
          case 'booking_window':
            formattedSettings.bookingWindow = setting.value;
            break;
          case 'opening_hours':
            formattedSettings.openingHours = setting.value;
            break;
          case 'excluded_days':
            formattedSettings.excludedDays = setting.value;
            break;
        }
      });

      return formattedSettings;
    }
  });

  // Date minimum : aujourd'hui + délai minimum
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + (settings?.bookingWindow.startDays || 1));
  minDate.setHours(0, 0, 0, 0);

  // Date maximum : aujourd'hui + délai maximum
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (settings?.bookingWindow.endDays || 60));
  maxDate.setHours(23, 59, 59, 999);

  // Fonction pour vérifier si un jour est exclu
  const isDayExcluded = (date: Date) => {
    const timestamp = date.getTime();
    return settings?.excludedDays?.includes(timestamp);
  };

  // Fonction pour obtenir les créneaux disponibles pour un jour donné
  const getAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay().toString();
    return settings?.openingHours?.[dayOfWeek]?.isOpen 
      ? settings.openingHours[dayOfWeek].slots 
      : [];
  };

  // Fonction pour calculer les heures disponibles à partir d'un créneau
  const calculateAvailableHours = (timeSlot: string) => {
    if (!selectedDate) return 0;
    
    const slots = getAvailableSlots(selectedDate);
    const slotIndex = slots.indexOf(timeSlot);
    let availableHours = 0;
    
    for (let i = slotIndex; i < slots.length - 1; i++) {
      const currentSlot = slots[i];
      const nextSlot = slots[i + 1];
      
      const currentHour = parseInt(currentSlot.split(':')[0]);
      const nextHour = parseInt(nextSlot.split(':')[0]);
      
      if (nextHour - currentHour === 1 && !bookedSlots[nextSlot]) {
        availableHours++;
      } else {
        break;
      }
    }
    
    return availableHours;
  };

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

  // Vérifier si un créneau est disponible
  const isSlotAvailable = (slot: string) => {
    return !bookedSlots[slot];
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
      const availableHours = calculateAvailableHours(timeSlot);
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
                  date > maxDate ||
                  isDayExcluded(date) ||
                  !settings?.openingHours?.[date.getDay()]?.isOpen
                }
                initialFocus
                locale={fr}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <FormField
          control={form.control}
          name="timeSlot"
          rules={{ required: "L'heure est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure *</FormLabel>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <TooltipProvider>
                  {getAvailableSlots(selectedDate).map((slot) => {
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
                                disabled={!isAvailable}
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
      )}

      {selectedDate && (
        <p className="text-sm text-gray-500 mt-2">
          Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      )}
    </div>
  );
};