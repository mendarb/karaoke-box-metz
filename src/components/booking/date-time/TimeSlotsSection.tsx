import { useFormContext } from "react-hook-form";
import { TimeSlots } from "./TimeSlots";

interface TimeSlotsSectionProps {
  form: any;
  availableSlots: string[];
  isLoading: boolean;
  requiredDuration?: number;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading,
  requiredDuration = 1,
}: TimeSlotsSectionProps) => {
  const { watch } = useFormContext();
  const selectedDate = watch("date");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center px-4 sm:px-0">
        Choisissez votre horaire
      </h3>
      <TimeSlots
        form={form}
        availableSlots={availableSlots}
        isLoading={isLoading}
        selectedDate={selectedDate}
      />
    </div>
  );
};