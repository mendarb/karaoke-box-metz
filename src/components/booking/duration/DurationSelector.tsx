import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface DurationSelectorProps {
  form: UseFormReturn<any>;
  onDurationChange: (duration: string) => void;
  availableHours: number;
}

export const DurationSelector = ({
  form,
  onDurationChange,
  availableHours,
}: DurationSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Durée</Label>
      <RadioGroup
        defaultValue={form.getValues("duration")}
        onValueChange={onDurationChange}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {["1", "2", "3", "4"].map((duration) => {
          const isDisabled = parseInt(duration) > availableHours;
          return (
            <Label
              key={duration}
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <RadioGroupItem 
                value={duration} 
                className="sr-only" 
                disabled={isDisabled}
              />
              <span className="text-xl font-bold">{duration}h</span>
              <span className="text-sm">
                {isDisabled ? "Non disponible" : "heure" + (parseInt(duration) > 1 ? "s" : "")}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};