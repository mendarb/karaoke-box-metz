import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";

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
  const durations = [
    { label: "1 heure", value: "1" },
    { label: "2 heures", value: "2" },
    { label: "3 heures", value: "3" },
    { label: "4 heures", value: "4" }
  ];

  const selectedDuration = form.watch("duration");
  const filteredDurations = durations.filter(d => Number(d.value) <= availableHours);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="h-4 w-4 text-violet-600" />
        <h2 className="text-base text-gray-900">
          Quelle durée souhaitez-vous ?
        </h2>
      </div>
      
      {availableHours < 4 && (
        <Alert variant="warning" className="py-1.5 border-none bg-amber-50">
          <AlertTriangle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Certaines durées ne sont pas disponibles pour ce créneau
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-2 w-full">
        {filteredDurations.map(({ label, value }) => (
          <Button
            key={value}
            type="button"
            variant={selectedDuration === value ? "default" : "outline"}
            className={cn(
              "relative h-11 font-medium transition-all w-full",
              selectedDuration === value ? "bg-violet-600 hover:bg-violet-700" : "hover:bg-violet-50",
              "flex flex-col items-center justify-center text-center",
              "transform active:scale-[0.98] transition-transform duration-200"
            )}
            onClick={() => {
              form.setValue("duration", value);
              onDurationChange(value);
            }}
          >
            <div className="text-sm">{label}</div>
            <div className="text-xs opacity-75">
              de karaoké
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};