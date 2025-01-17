import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { TimeSlot } from "./time-slots/TimeSlot";
import { LoadingSkeleton } from "./time-slots/LoadingSkeleton";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  availableSlots: { slots: string[], blockedSlots: Set<string> };
  isLoading: boolean;
}

export const TimeSlotsSection = ({ form, availableSlots, isLoading }: TimeSlotsSectionProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const { slots, blockedSlots } = availableSlots;

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="timeSlot"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Heure d'arrivée</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {slots.map((slot) => {
                const isBlocked = blockedSlots.has(slot);
                return (
                  <TimeSlot
                    key={slot}
                    slot={slot}
                    isSelected={field.value === slot}
                    isDisabled={isBlocked}
                    onSelect={() => field.onChange(slot)}
                    date={form.getValues("date")}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};