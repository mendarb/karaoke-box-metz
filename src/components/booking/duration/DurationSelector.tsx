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
    { label: "1h", value: "1" },
    { label: "2h", value: "2" },
    { label: "3h", value: "3" },
    { label: "4h", value: "4" }
  ];

  const selectedDuration = form.watch("duration");
  const filteredDurations = durations.filter(d => Number(d.value) <= availableHours);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg md:text-xl text-gray-900">
          Quelle durée souhaitez-vous ?
        </h2>
      </div>
      <p className="text-sm text-gray-600">
        Choisissez la durée de votre session
      </p>
      
      {availableHours < 4 && (
        <Alert variant="warning" className="py-2 border-none bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
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
              "relative h-14 md:h-16 font-medium transition-all w-full",
              selectedDuration === value ? "bg-violet-600 hover:bg-violet-700" : "hover:bg-violet-50",
              "flex flex-col items-center justify-center text-center",
              "transform active:scale-[0.98] transition-transform duration-200"
            )}
            onClick={() => {
              form.setValue("duration", value);
              onDurationChange(value);
            }}
          >
            <div className="text-base">{label}</div>
          </Button>
        ))}
      </div>
    </div>
  );
};