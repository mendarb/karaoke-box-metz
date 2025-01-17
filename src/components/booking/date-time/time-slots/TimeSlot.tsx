import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
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
      variant="outline"
      className={cn(
        "w-full flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200",
        "sm:py-6 py-3", // Reduced padding on mobile
        isDisabled && "opacity-50 bg-gray-100 hover:bg-gray-100 cursor-not-allowed text-gray-500",
        isSelected && !isDisabled && "bg-violet-600 hover:bg-violet-700 text-white border-violet-600",
        !isSelected && !isDisabled && "hover:border-violet-600 hover:text-violet-600",
        hasDiscount && !isSelected && !isDisabled && "border-green-500 text-green-700",
        hasDiscount && isSelected && !isDisabled && "bg-green-600 hover:bg-green-700"
      )}
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        if (!isDisabled) {
          onSelect(slot);
        }
      }}
    >
      <span className="text-base sm:text-lg font-semibold">{slot}h</span>
      {hasDiscount && !isDisabled && (
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute -top-2 -right-2 bg-green-100 text-green-700 border border-green-200",
            "text-xs py-0.5", // Smaller badge on mobile
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
            <p>Créneau indisponible</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return slotButton;
};