import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { BookingCalendar } from "./calendar/BookingCalendar";

interface CalendarSectionProps {
  form: UseFormReturn<any>;
  selectedDate: Date | undefined;
  minDate: Date;
  maxDate: Date;
  disabledDates: Date[];
  onDateSelect: (date: Date) => void;
}

export const CalendarSection = ({
  selectedDate,
  minDate,
  maxDate,
  disabledDates,
  onDateSelect
}: CalendarSectionProps) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <BookingCalendar
          disabledDates={disabledDates}
          onSelect={onDateSelect}
          selectedDate={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </CardContent>
    </Card>
  );
};