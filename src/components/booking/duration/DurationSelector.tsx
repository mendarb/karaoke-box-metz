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
      <Label className="text-gray-700 font-normal">Durée</Label>
      <div className="flex gap-2">
        {["1", "2", "3", "4"].map((duration) => {
          const isDisabled = parseInt(duration) > availableHours;
          return (
            <Button
              key={duration}
              type="button"
              variant={selectedDuration === duration ? "default" : "outline"}
              className={cn(
                "h-10 px-4 rounded border-gray-200",
                selectedDuration === duration ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-white hover:bg-gray-50",
                "w-[90px] justify-center",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={() => onDurationChange(duration)}
            >
              {duration}
              <span className="ml-1 text-sm">
                {duration === "1" ? "heure" : "heures"}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};