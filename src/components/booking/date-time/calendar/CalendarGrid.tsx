import { fr } from "date-fns/locale";
import { CalendarDay } from "./CalendarDay";

interface CalendarGridProps {
  month: Date;
  selected?: Date;
  disabledDays?: Date[];
  onSelect?: (date: Date) => void;
}

export const CalendarGrid = ({
  month,
  selected,
  disabledDays = [],
  onSelect,
}: CalendarGridProps) => {
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  const getDaysInMonth = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const days = [];
    let current = start;
    
    // Get the first Monday
    while (current.getDay() !== 1) {
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
    }
    
    // Get 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    }
    
    return days;
  };

  const days = getDaysInMonth(month);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-gray-500 text-center text-sm h-10 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selected?.toDateString() === day.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();
          const isDisabled = disabledDays.some(
            (disabled) => disabled.toDateString() === day.toDateString()
          );
          const isOutside = day.getMonth() !== month.getMonth();

          return (
            <CalendarDay
              key={index}
              day={day}
              isSelected={isSelected}
              isToday={isToday}
              isDisabled={isDisabled}
              isOutside={isOutside}
              onClick={() => !isDisabled && onSelect?.(day)}
              aria-selected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};