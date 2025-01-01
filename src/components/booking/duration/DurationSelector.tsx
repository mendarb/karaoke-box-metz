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
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl text-gray-900">
          Quelle durée souhaitez-vous ?
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Choisissez la durée de votre session. Plus la durée est longue, 
          plus le prix par personne est avantageux.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {availableHours < 4 && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              En raison des réservations existantes, certaines durées ne sont pas disponibles 
              pour le créneau sélectionné.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredDurations.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant={selectedDuration === value ? "default" : "outline"}
              className={cn(
                "relative h-20 font-semibold transition-all",
                selectedDuration === value ? "bg-violet-600 hover:bg-violet-700 scale-105" : "hover:bg-violet-50",
                "flex flex-col items-center justify-center text-center"
              )}
              onClick={() => {
                form.setValue("duration", value);
                onDurationChange(value);
              }}
            >
              <div className="text-lg">{label}</div>
              <div className="text-sm opacity-75">
                de karaoké
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};