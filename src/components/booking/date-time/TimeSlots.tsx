import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

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
    return <div>Chargement des créneaux...</div>;
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant={value === slot ? "default" : "outline"}
          className={cn(
            "w-full",
            value === slot && "bg-violet-600 hover:bg-violet-700"
          )}
          onClick={() => onChange(slot)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {slot}
        </Button>
      ))}
    </div>
  );
};