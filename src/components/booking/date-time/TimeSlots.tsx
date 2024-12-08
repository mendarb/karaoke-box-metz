import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  bookedSlots: { [key: string]: number };
}

export const TimeSlots = ({ form, availableSlots, bookedSlots }: TimeSlotsProps) => {
  const isSlotAvailable = (slot: string) => !bookedSlots[slot];

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
                            className={`w-full ${
                              field.value === slot
                                ? "bg-violet-600 hover:bg-violet-700"
                                : ""
                            } ${
                              !isAvailable
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => isAvailable && field.onChange(slot)}
                            disabled={!isAvailable}
                          >
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