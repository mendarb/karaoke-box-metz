import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  disabledSlots: string[];
  isLoading: boolean;
}

export const TimeSlots = ({
  form,
  availableSlots,
  disabledSlots,
  isLoading,
}: TimeSlotsProps) => {
  const selectedTimeSlot = form.watch("timeSlot");

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {availableSlots.map((slot) => {
        const isDisabled = disabledSlots.includes(slot);
        const hour = parseInt(slot);
        const formattedSlot = `${hour}:00`;

        return (
          <Button
            key={slot}
            type="button"
            variant={selectedTimeSlot === slot ? "default" : "outline"}
            className={cn(
              "w-full",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled || isLoading}
            onClick={() => form.setValue("timeSlot", slot)}
          >
            {formattedSlot}
          </Button>
        );
      })}
    </div>
  );
};