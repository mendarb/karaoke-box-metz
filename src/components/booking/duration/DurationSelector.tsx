import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
  const durations = ["1", "2", "3", "4"];
  const selectedDuration = form.watch("duration");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {durations.map((duration) => {
        const isDisabled = parseInt(duration) > availableHours;
        
        return (
          <Button
            key={duration}
            type="button"
            variant={selectedDuration === duration ? "default" : "outline"}
            className={cn(
              "relative h-20 font-semibold",
              selectedDuration === duration && "bg-violet-600 hover:bg-violet-700",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
            onClick={() => {
              form.setValue("duration", duration);
              onDurationChange(duration);
            }}
          >
            <div className="text-center">
              <div className="text-lg">{duration}h</div>
              <div className="text-sm opacity-80">
                {isDisabled ? "Indisponible" : ""}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};