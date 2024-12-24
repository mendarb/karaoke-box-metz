import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
import { supabase } from "@/lib/supabase";

interface TimeSlotsSectionProps {
  form: any;
  availableSlots: string[];
  isLoading: boolean;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading,
}: TimeSlotsSectionProps) => {
  const [disabledSlots, setDisabledSlots] = useState<string[]>([]);
  const { watch } = useFormContext();
  const selectedDate = watch("date");

  useEffect(() => {
    const checkBookedSlots = async () => {
      if (!selectedDate) return;

      try {
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('date', selectedDate)
          .neq('status', 'cancelled')
          .is('deleted_at', null);

        if (error) {
          console.error('Error checking booked slots:', error);
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
      } catch (error) {
        console.error('Error checking booked slots:', error);
      }
    };

    checkBookedSlots();
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Choisissez votre horaire</h3>
      <TimeSlots
        form={form}
        availableSlots={availableSlots}
        disabledSlots={disabledSlots}
        isLoading={isLoading}
      />
    </div>
  );
};