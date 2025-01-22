import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeSlotProps {
  slot: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (slot: string) => void;
  date: Date;
  selectedSlots?: string[];
}

export const TimeSlot = ({
  slot,
  isSelected,
  isDisabled,
  onSelect,
  date,
  selectedSlots = []
}: TimeSlotProps) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(slot);
    }
  };

  // Convertir le créneau en plage horaire
  const startHour = parseInt(slot);
  const endHour = startHour + 1;
  const timeRange = `${startHour}h-${endHour}h`;

  // Déterminer le label en fonction de la position dans la sélection
  const getSelectionLabel = () => {
    if (!isSelected) return null;
    
    const index = selectedSlots.indexOf(slot);
    if (index === 0) return "Début";
    if (index > 0) return `+${index}h`;
    return null;
  };

  const selectionLabel = getSelectionLabel();

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full relative py-6 flex flex-col items-center gap-2 transition-all",
        isSelected && "bg-violet-600 hover:bg-violet-700 scale-105 shadow-lg",
        !isSelected && "hover:border-violet-300",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <Clock className={cn(
        "w-4 h-4 mb-1",
        isSelected && "text-white",
        !isSelected && "text-violet-600"
      )} />
      <span className={cn(
        "font-medium",
        isSelected && "text-white"
      )}>
        {timeRange}
      </span>
      {selectionLabel && (
        <div className={cn(
          "absolute -top-2 left-1/2 transform -translate-x-1/2 bg-violet-600 text-white text-xs px-2 py-1 rounded-full",
          "animate-fadeIn"
        )}>
          {selectionLabel}
        </div>
      )}
    </Button>
  );
};