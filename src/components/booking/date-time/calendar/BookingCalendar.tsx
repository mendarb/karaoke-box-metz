import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="w-full max-w-lg mx-auto bg-white">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        disabled={(date) =>
          date < minDate ||
          date > maxDate ||
          disabledDates.some(
            (disabledDate) =>
              disabledDate.toDateString() === date.toDateString()
          )
        }
        locale={fr}
        defaultMonth={defaultMonth}
        className="border-none shadow-none"
        components={{
          IconLeft: ({ ...props }) => (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              {...props}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ),
          IconRight: ({ ...props }) => (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              {...props}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ),
        }}
      />
    </div>
  );
};