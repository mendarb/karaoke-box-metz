import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeSlotProps {
  slot: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (slot: string) => void;
}

export const TimeSlot = ({ slot, isSelected, isDisabled, onSelect }: TimeSlotProps) => {
  const slotButton = (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full flex items-center gap-2 transition-all duration-200",
        isDisabled && "opacity-50 bg-gray-100 hover:bg-gray-100 cursor-not-allowed",
        isSelected && "bg-violet-600 hover:bg-violet-700 scale-105"
      )}
      disabled={isDisabled}
      onClick={() => onSelect(slot)}
    >
      <Clock className="h-4 w-4" />
      {slot}
    </Button>
  );

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {slotButton}
          </TooltipTrigger>
          <TooltipContent>
            <p>Créneau déjà réservé</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return slotButton;
};