import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

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

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {availableSlots.map((slot) => {
        const hour = parseInt(slot);
        const formattedSlot = `${hour}:00`;

        return (
          <Button
            key={slot}
            type="button"
            variant={selectedTimeSlot === slot ? "default" : "outline"}
            className={cn(
              "w-full flex items-center gap-2 transition-all",
              selectedTimeSlot === slot && "bg-violet-600 hover:bg-violet-700"
            )}
            disabled={isLoading}
            onClick={() => form.setValue("timeSlot", slot)}
          >
            <Clock className="h-4 w-4" />
            {formattedSlot}
          </Button>
        );
      })}
    </div>
  );
};