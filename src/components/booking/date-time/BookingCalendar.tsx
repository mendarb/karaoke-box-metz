import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarGrid } from "./calendar/CalendarGrid";

interface BookingCalendarProps {
  form: UseFormReturn<any>;
  disabledDates: Date[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  minDate: Date;
  maxDate: Date;
}

export const BookingCalendar = ({
  form,
  disabledDates,
  onDateSelect,
  selectedDate,
  minDate,
  maxDate,
}: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <FormField
      control={form.control}
      name="date"
      rules={{ required: "La date est requise" }}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base font-medium flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-600" />
            Date *
          </FormLabel>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-full max-w-[400px] mx-auto">
              <CalendarHeader
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
              <CalendarGrid
                month={currentMonth}
                selected={field.value}
                disabledDays={disabledDates}
                onSelect={(date) => {
                  const normalizedDate = startOfDay(date);
                  field.onChange(normalizedDate);
                  onDateSelect(normalizedDate);
                }}
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};