import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
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
  const selectedDuration = form.watch("duration");

  return (
    <div className="space-y-4">
      <Label>Durée</Label>
      <div className="flex flex-wrap gap-2">
        {["1", "2", "3", "4"].map((duration) => {
          const isDisabled = parseInt(duration) > availableHours;
          return (
            <Button
              key={duration}
              type="button"
              variant={selectedDuration === duration ? "default" : "outline"}
              className={cn(
                "flex-1 min-w-[60px]",
                selectedDuration === duration && "bg-violet-600 hover:bg-violet-700",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={() => onDurationChange(duration)}
            >
              {duration}h
              <span className="ml-1 text-sm">
                {isDisabled ? "Non disponible" : "heure" + (parseInt(duration) > 1 ? "s" : "")}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  );
};