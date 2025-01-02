import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2 px-0 space-y-1">
        <CardTitle className="text-xl text-gray-900">
          Quelle durée souhaitez-vous ?
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Choisissez la durée de votre session.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {availableHours < 4 && (
          <Alert variant="warning" className="mb-3 py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Certaines durées ne sont pas disponibles pour ce créneau.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-2 gap-2">
          {filteredDurations.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant={selectedDuration === value ? "default" : "outline"}
              className={cn(
                "relative h-16 font-medium transition-all",
                selectedDuration === value ? "bg-violet-600 hover:bg-violet-700" : "hover:bg-violet-50",
                "flex flex-col items-center justify-center text-center"
              )}
              onClick={() => {
                form.setValue("duration", value);
                onDurationChange(value);
              }}
            >
              <div className="text-base">{label}</div>
              <div className="text-xs opacity-75">
                de karaoké
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};