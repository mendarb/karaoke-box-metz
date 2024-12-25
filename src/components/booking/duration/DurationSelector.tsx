import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

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
      <Label className="text-base font-medium text-gray-700">Durée</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {["1", "2", "3", "4"].map((duration) => {
          const isDisabled = parseInt(duration) > availableHours;
          return (
            <Button
              key={duration}
              type="button"
              variant={selectedDuration === duration ? "default" : "outline"}
              className={cn(
                "h-12 px-4 rounded-lg border-gray-200",
                selectedDuration === duration ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-white hover:bg-gray-50",
                "justify-center items-center gap-2",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={() => onDurationChange(duration)}
            >
              <Clock className="h-4 w-4" />
              {duration}
              <span className="text-sm">
                {duration === "1" ? "heure" : "heures"}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};