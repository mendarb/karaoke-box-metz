import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDay } from "./CalendarDay";

interface CalendarGridProps {
  month: Date;
  days: Date[];
  selectedDate: Date | undefined;
  disabledDates: Date[];
  onSelect: (date: Date) => void;
}

export const CalendarGrid = ({ month, days, selectedDate, disabledDates, onSelect }: CalendarGridProps) => {
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

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
        {days.map((day, dayIdx) => (
          <CalendarDay
            key={day.toString()}
            day={day}
            selectedDate={selectedDate}
            disabledDates={disabledDates}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};