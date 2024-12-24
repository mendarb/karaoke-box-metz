import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-sm">
          Aucun créneau disponible pour cette date
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Veuillez sélectionner une autre date
        </p>
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
  );
};