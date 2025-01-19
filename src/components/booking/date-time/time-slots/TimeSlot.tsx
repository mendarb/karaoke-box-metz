import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  slot: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (slot: string) => void;
  date: Date;
}

export const TimeSlot = ({
  slot,
  isSelected,
  isDisabled,
  onSelect,
  date
}: TimeSlotProps) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(slot);
    }
  };

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full",
        isSelected && "bg-violet-600 hover:bg-violet-700",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {slot}
    </Button>
  );
};