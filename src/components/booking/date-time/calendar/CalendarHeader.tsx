import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isPreviousMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
}

export const CalendarHeader = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  isPreviousMonthDisabled,
  isNextMonthDisabled
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Button
        type="button"
        variant="ghost"
        onClick={onPreviousMonth}
        disabled={isPreviousMonthDisabled}
        className={cn(
          "h-9 w-9 p-0",
          isPreviousMonthDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-lg font-semibold text-gray-900 capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={onNextMonth}
        disabled={isNextMonthDisabled}
        className={cn(
          "h-9 w-9 p-0",
          isNextMonthDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};