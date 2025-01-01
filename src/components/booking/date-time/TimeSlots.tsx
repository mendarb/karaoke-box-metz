import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  isLoading: boolean;
  selectedDate: Date;
}

export const TimeSlots = ({
  form,
  availableSlots,
  isLoading,
  selectedDate
}: TimeSlotsProps) => {
  const selectedTimeSlot = form.watch("timeSlot");

  // Optimiser la requête avec React Query
  const { data: disabledSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['booked-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('🔍 Vérification des créneaux pour:', formattedDate);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors du chargement des créneaux réservés:', error);
        throw error;
      }

      const bookedSlots = new Set<string>();
      bookings?.forEach(booking => {
        const startHour = parseInt(booking.time_slot);
        const duration = parseInt(booking.duration);
        
        for (let hour = startHour; hour < startHour + duration; hour++) {
          bookedSlots.add(`${hour.toString().padStart(2, '0')}:00`);
        }
      });

      return Array.from(bookedSlots);
    },
    enabled: !!selectedDate,
    staleTime: 30000, // Cache de 30 secondes
    cacheTime: 300000, // Cache de 5 minutes
  });

  // Mémoriser les créneaux triés
  const sortedSlots = useMemo(() => {
    return [...availableSlots].sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      return hourA - hourB;
    });
  }, [availableSlots]);

  if (isLoadingSlots || isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index}
            className="h-10 bg-gray-100 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {sortedSlots.map((slot) => {
        const isDisabled = disabledSlots.includes(slot);

        const slotButton = (
          <Button
            key={slot}
            type="button"
            variant={selectedTimeSlot === slot ? "default" : "outline"}
            className={cn(
              "w-full flex items-center gap-2 transition-all duration-200",
              isDisabled && "opacity-50 bg-gray-100 hover:bg-gray-100 cursor-not-allowed",
              selectedTimeSlot === slot && "bg-violet-600 hover:bg-violet-700 scale-105"
            )}
            disabled={isDisabled || isLoading}
            onClick={() => {
              form.setValue("timeSlot", slot);
            }}
          >
            <Clock className="h-4 w-4" />
            {slot}
          </Button>
        );

        if (isDisabled) {
          return (
            <TooltipProvider key={slot}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {slotButton}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Créneau déjà réservé</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return slotButton;
      })}
    </div>
  );
};