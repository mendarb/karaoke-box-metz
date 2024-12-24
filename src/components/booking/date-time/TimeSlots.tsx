import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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