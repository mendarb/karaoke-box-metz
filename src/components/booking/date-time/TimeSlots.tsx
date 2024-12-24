import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeSlotsProps {
  value: string;
  onChange: (value: string) => void;
  availableSlots: string[];
  isLoading: boolean;
}

export const TimeSlots = ({
  value,
  onChange,
  availableSlots,
  isLoading
}: TimeSlotsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Chargement des créneaux disponibles...
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Sélectionnez l'heure qui vous convient le mieux
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {availableSlots.map((slot) => (
          <Button
            key={slot}
            variant={value === slot ? "default" : "outline"}
            className={cn(
              "w-full transition-all",
              value === slot && "bg-violet-600 hover:bg-violet-700",
              "hover:border-violet-200"
            )}
            onClick={() => onChange(slot)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {slot}
          </Button>
        ))}
      </div>
    </div>
  );
};