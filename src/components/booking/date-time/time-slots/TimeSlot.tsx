import { Button } from "@/components/ui/button";
import { Clock, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TimeSlotProps {
  slot: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (slot: string) => void;
  date?: Date;
}

export const TimeSlot = ({ slot, isSelected, isDisabled, onSelect, date }: TimeSlotProps) => {
  const hour = parseInt(slot);
  const isDiscountedTime = hour < 18;
  const isDiscountedDay = date ? [3, 4].includes(date.getDay()) : false;
  const hasDiscount = isDiscountedTime && isDiscountedDay;

  const slotButton = (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full h-14 sm:h-12 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 text-base relative",
        isDisabled && "opacity-50 bg-gray-100 hover:bg-gray-100 cursor-not-allowed",
        isSelected && "bg-violet-600 hover:bg-violet-700 scale-105 text-white",
        !isSelected && !isDisabled && "hover:border-violet-600 hover:text-violet-600",
        hasDiscount && !isSelected && "border-green-500 text-green-700",
        hasDiscount && isSelected && "bg-green-600 hover:bg-green-700"
      )}
      disabled={isDisabled}
      onClick={() => onSelect(slot)}
    >
      <Clock className="h-4 w-4" />
      {slot}
      {hasDiscount && (
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute -top-2 -right-2 bg-green-100 text-green-700 border border-green-200",
            isSelected && "bg-white text-green-700"
          )}
        >
          <Percent className="h-3 w-3 mr-0.5" />
          -20%
        </Badge>
      )}
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

  if (hasDiscount) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {slotButton}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-green-700">-20% les mercredis et jeudis avant 18h</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return slotButton;
};