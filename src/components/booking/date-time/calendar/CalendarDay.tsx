import { format, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  day: Date;
  selectedDate: Date | undefined;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
}

export const CalendarDay = ({ day, selectedDate, disabledDates, onSelect }: CalendarDayProps) => {
  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isDisabled = disabledDates.some(disabledDate => isSameDay(day, disabledDate));
  const dayToday = isToday(day);

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(day)}
      disabled={isDisabled}
      className={cn(
        "h-10 w-full rounded-lg text-sm font-medium transition-colors",
        "hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
        {
          "bg-violet-600 text-white hover:bg-violet-700": isSelected,
          "text-gray-900": !isSelected && !isDisabled,
          "text-gray-400 cursor-not-allowed hover:bg-transparent": isDisabled,
          "ring-2 ring-violet-200": dayToday && !isSelected,
        }
      )}
    >
      {format(day, "d")}
    </button>
  );
};