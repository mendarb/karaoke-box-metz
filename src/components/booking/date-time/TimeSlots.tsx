import { Button } from "@/components/ui/button";
import { 
  FormControl, 
  FormField,
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  bookedSlots: { [key: string]: number };
  isLoading?: boolean;
}

export const TimeSlots = ({ 
  form, 
  availableSlots, 
  bookedSlots,
  isLoading = false 
}: TimeSlotsProps) => {
  const isSlotAvailable = (slot: string) => !bookedSlots[slot];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!availableSlots.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      rules={{ required: "L'heure est requise" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Heure *</FormLabel>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <TooltipProvider>
              {availableSlots.map((slot) => {
                const isAvailable = isSlotAvailable(slot);
                return (
                  <Tooltip key={slot}>
                    <TooltipTrigger asChild>
                      <div>
                        <FormControl>
                          <Button
                            type="button"
                            variant={field.value === slot ? "default" : "outline"}
                            className={cn(
                              "w-full transition-all duration-200",
                              field.value === slot
                                ? "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-100 scale-105"
                                : "hover:border-violet-300 hover:scale-105",
                              !isAvailable && "opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100 hover:scale-100"
                            )}
                            onClick={() => isAvailable && field.onChange(slot)}
                            disabled={!isAvailable}
                          >
                            <Clock className="w-4 h-4 mr-2" />
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
  );
};