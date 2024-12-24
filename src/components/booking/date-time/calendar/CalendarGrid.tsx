import { format, isSameDay, isToday, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
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
    const isOutsideInterval = !isWithinInterval(date, { start: minDate, end: maxDate });
    const isDisabledDate = disabledDates.some(disabledDate => 
      isSameDay(date, disabledDate)
    );
    return isOutsideInterval || isDisabledDate;
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 mb-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, dayIdx) => {
          const isDisabled = isDateDisabled(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const dayToday = isToday(day);

          // Utiliser la locale fr pour obtenir le bon numéro de jour (1-7, où 1 est lundi)
          const dayOfWeek = parseInt(format(day, 'i', { locale: fr }));
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "p-0.5",
                dayIdx === 0 && `col-start-${dayOfWeek}`
              )}
            >
              <button
                type="button"
                onClick={() => !isDisabled && onSelect(day)}
                disabled={isDisabled}
                className={cn(
                  "w-full h-9 rounded-lg text-sm font-medium transition-colors relative",
                  "hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                  {
                    "bg-violet-600 text-white hover:bg-violet-700": isSelected,
                    "text-gray-900": !isSelected && !isDisabled,
                    "text-gray-400 cursor-not-allowed hover:bg-transparent": isDisabled,
                    "ring-2 ring-violet-200": dayToday && !isSelected,
                  }
                )}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};