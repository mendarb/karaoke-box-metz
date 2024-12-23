import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface CalendarDayProps extends ButtonProps {
  day: Date;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOutside: boolean;
}

export const CalendarDay = ({
  day,
  isSelected,
  isToday,
  isDisabled,
  isOutside,
  ...props
}: CalendarDayProps) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "h-10 w-10 p-0 font-normal rounded-full transition-colors relative",
        "hover:bg-violet-100 focus:bg-violet-100 focus:outline-none",
        isSelected && "bg-violet-600 text-white hover:bg-violet-700 hover:text-white focus:bg-violet-700 focus:text-white font-medium",
        isToday && !isSelected && "bg-violet-100 text-violet-900",
        isDisabled && "text-gray-400 opacity-50 hover:bg-transparent cursor-not-allowed",
        isOutside && "text-gray-400 opacity-50",
        props.className
      )}
    >
      {day.getDate()}
    </button>
  );
};