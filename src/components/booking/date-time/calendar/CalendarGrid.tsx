import { format, isSameDay, isToday, isBefore, isAfter, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar, Clock, X } from "lucide-react";

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
        {days.map((day, dayIndex) => {
          const normalizedDay = startOfDay(day);
          const isSelected = selectedDate ? isSameDay(normalizedDay, selectedDate) : false;
          const isDisabled = isDateDisabled(normalizedDay);
          const dayToday = isToday(normalizedDay);
          const hasAvailability = !isDisabled;

          return (
            <button
              key={normalizedDay.toString()}
              type="button"
              onClick={() => !isDisabled && onSelect(normalizedDay)}
              disabled={isDisabled}
              className={cn(
                "relative h-12 w-full rounded-lg text-sm font-medium transition-all",
                "hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                {
                  "bg-violet-600 text-white hover:bg-violet-700": isSelected,
                  "bg-white border border-gray-200": !isSelected && !isDisabled,
                  "bg-gray-50 border border-gray-200": isDisabled,
                  "ring-2 ring-violet-200": dayToday && !isSelected,
                }
              )}
            >
              <span className="block text-center">
                {format(normalizedDay, "d")}
              </span>
              {hasAvailability && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <Clock className="h-3 w-3 text-violet-500" />
                </div>
              )}
              {isDisabled && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <X className="h-3 w-3 text-gray-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};