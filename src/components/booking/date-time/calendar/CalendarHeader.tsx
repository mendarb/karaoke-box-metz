import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

interface CalendarHeaderProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const CalendarHeader = ({ currentMonth, onMonthChange }: CalendarHeaderProps) => {
  const previousMonth = () => {
    const firstDayNextMonth = new Date(currentMonth);
    firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() - 1);
    onMonthChange(firstDayNextMonth);
  };

  const nextMonth = () => {
    const firstDayNextMonth = new Date(currentMonth);
    firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + 1);
    onMonthChange(firstDayNextMonth);
  };

  return (
    <div className="flex justify-center pt-1 relative items-center gap-1">
      <Button
        variant="ghost"
        className="h-9 w-9 p-0 absolute left-1 hover:bg-violet-50 text-gray-500 hover:text-gray-900"
        onClick={previousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-lg font-medium text-gray-900">
        {currentMonth.toLocaleString(fr, { month: 'long', year: 'numeric' })}
      </div>
      <Button
        variant="ghost"
        className="h-9 w-9 p-0 absolute right-1 hover:bg-violet-50 text-gray-500 hover:text-gray-900"
        onClick={nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};