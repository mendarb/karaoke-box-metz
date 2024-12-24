import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

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
  const [disabledSlots, setDisabledSlots] = useState<string[]>([]);
  const selectedTimeSlot = form.watch("timeSlot");

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (!selectedDate) return;

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Error loading booked slots:', error);
        return;
      }

      const bookedSlots = new Set<string>();
      bookings?.forEach(booking => {
        const startHour = parseInt(booking.time_slot);
        const duration = parseInt(booking.duration);
        
        // Marquer tous les créneaux couverts par cette réservation comme indisponibles
        for (let hour = startHour; hour < startHour + duration; hour++) {
          bookedSlots.add(`${hour}:00`);
        }
      });

      setDisabledSlots(Array.from(bookedSlots));
    };

    loadBookedSlots();
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {availableSlots.map((slot) => {
        const isDisabled = disabledSlots.includes(slot);
        const hour = parseInt(slot);
        const formattedSlot = `${hour}:00`;

        const slotButton = (
          <Button
            key={slot}
            type="button"
            variant={selectedTimeSlot === slot ? "default" : "outline"}
            className={cn(
              "w-full flex items-center gap-2 transition-all",
              isDisabled && "opacity-50 bg-gray-100 hover:bg-gray-100 cursor-not-allowed",
              selectedTimeSlot === slot && "bg-violet-600 hover:bg-violet-700"
            )}
            disabled={isDisabled || isLoading}
            onClick={() => form.setValue("timeSlot", slot)}
          >
            <Clock className="h-4 w-4" />
            {formattedSlot}
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