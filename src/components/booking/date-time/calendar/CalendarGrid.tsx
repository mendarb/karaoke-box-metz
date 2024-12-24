import { format, isSameDay, isToday, isBefore, isAfter, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  month: Date;
  days: Date[];
  selectedDate: Date | undefined;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}

export const CalendarGrid = ({ 
  days, 
  selectedDate, 
  disabledDates, 
  onSelect,
  minDate,
  maxDate
}: CalendarGridProps) => {
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const isDateDisabled = (date: Date) => {
    const normalizedDate = startOfDay(date);
    const normalizedMinDate = startOfDay(minDate);
    const normalizedMaxDate = startOfDay(maxDate);

    // Vérifier si la date est dans la plage autorisée
    if (isBefore(normalizedDate, normalizedMinDate) || isAfter(normalizedDate, normalizedMaxDate)) {
      return true;
    }

    // Vérifier si la date est dans les dates désactivées
    return disabledDates.some(disabledDate => 
      isSameDay(normalizedDate, startOfDay(disabledDate))
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const normalizedDay = startOfDay(day);
          const isSelected = selectedDate ? isSameDay(normalizedDay, selectedDate) : false;
          const isDisabled = isDateDisabled(normalizedDay);
          const dayToday = isToday(normalizedDay);

          return (
            <button
              key={normalizedDay.toString()}
              type="button"
              onClick={() => !isDisabled && onSelect(normalizedDay)}
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
              {format(normalizedDay, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};