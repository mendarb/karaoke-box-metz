import { useEffect } from "react";
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
  const { settings, isLoading: isLoadingSettings } = useBookingSettings();
  const { availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(selectedDate, settings);

  useEffect(() => {
    if (!isLoadingSlots) {
      onAvailabilityChange(availableSlots.length > 0);
    }
  }, [availableSlots, isLoadingSlots, onAvailabilityChange]);

  if (isLoadingSettings || isLoadingSlots) {
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
      isLoading={isLoadingSlots}
    />
  );
};