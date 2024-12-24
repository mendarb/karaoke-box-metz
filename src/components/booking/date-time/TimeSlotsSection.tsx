import { useEffect, useState } from "react";
import { TimeSlots } from "./TimeSlots";
import { useBookingSettings } from "./hooks/useBookingSettings";
import { useAvailableSlots } from "./hooks/useAvailableSlots";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UseFormReturn } from "react-hook-form";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  selectedDate: Date | undefined;
  onAvailabilityChange: (hasAvailableSlots: boolean) => void;
}

export const TimeSlotsSection = ({
  form,
  selectedDate,
  onAvailabilityChange,
}: TimeSlotsSectionProps) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings, isLoading: isLoadingSettings } = useBookingSettings();
  const { getAvailableSlots } = useAvailableSlots();

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate || !settings) return;
      
      setIsLoading(true);
      try {
        const slots = await getAvailableSlots(selectedDate, settings);
        setAvailableSlots(slots);
        onAvailabilityChange(slots.length > 0);
      } catch (error) {
        console.error('Error loading slots:', error);
        setAvailableSlots([]);
        onAvailabilityChange(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlots();
  }, [selectedDate, settings, getAvailableSlots, onAvailabilityChange]);

  if (isLoadingSettings || isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        Veuillez sélectionner une date
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  return (
    <TimeSlots
      form={form}
      availableSlots={availableSlots}
      selectedDate={selectedDate}
      isLoading={isLoading}
    />
  );
};