import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  isLoading?: boolean;
}

export const TimeSlots = ({ form, availableSlots, isLoading = false }: TimeSlotsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!availableSlots.length) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50/50 rounded-lg border border-gray-100">
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
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Heure *</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableSlots.map((slot) => (
              <FormControl key={slot}>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full h-12 gap-2 transition-all duration-200",
                    field.value === slot
                      ? "bg-violet-600 text-white hover:bg-violet-700 border-violet-600 hover:border-violet-700 shadow-lg shadow-violet-100 scale-105"
                      : "hover:border-violet-300 hover:bg-violet-50/50"
                  )}
                  onClick={() => field.onChange(slot)}
                >
                  <Clock className={cn(
                    "w-4 h-4",
                    field.value === slot ? "text-white" : "text-violet-600"
                  )} />
                  {slot}
                </Button>
              </FormControl>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};