import { format, isSameDay, isToday, isBefore, isAfter, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarDay } from "./CalendarDay";

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

          return (
            <div
              key={day.toString()}
              className={cn(
                "p-0.5",
                dayIdx === 0 && `col-start-${format(day, 'i')}`
              )}
            >
              <CalendarDay
                day={day}
                selectedDate={selectedDate}
                disabledDates={disabledDates}
                onSelect={onSelect}
                isDisabled={isDisabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};