import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { fr } from "date-fns/locale";
import { startOfToday, isBefore, startOfDay } from "date-fns";

interface BookingCalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  disabledDates: Date[];
  minDate: Date;
  maxDate: Date;
  defaultMonth: Date;
}

export const BookingCalendar = ({
  selectedDate,
  onSelect,
  disabledDates,
  minDate,
  maxDate,
  defaultMonth,
}: BookingCalendarProps) => {
  const today = startOfToday();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelect(date)}
          disabled={(date) =>
            isBefore(startOfDay(date), today) ||
            date < minDate ||
            date > maxDate ||
            disabledDates.some(
              (disabledDate) =>
                disabledDate.toDateString() === date.toDateString()
            )
          }
          locale={fr}
          defaultMonth={defaultMonth}
          className="rounded-md border"
        />
      </div>
    </Card>
  );
};