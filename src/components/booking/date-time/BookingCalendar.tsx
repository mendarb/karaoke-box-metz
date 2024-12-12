import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { startOfDay, format } from "date-fns";
import { fr } from "date-fns/locale";

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
  maxDate
}: BookingCalendarProps) => {
  return (
    <FormField
      control={form.control}
      name="date"
      rules={{ required: "La date est requise" }}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date *</FormLabel>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={async (date) => {
              if (!date) return;
              const normalizedDate = startOfDay(date);
              field.onChange(normalizedDate);
              onDateSelect(normalizedDate);
            }}
            disabled={(date) => {
              const normalizedDate = startOfDay(date);
              return disabledDates.some(disabledDate => 
                startOfDay(disabledDate).getTime() === normalizedDate.getTime()
              );
            }}
            fromDate={minDate}
            toDate={maxDate}
            initialFocus
            locale={fr}
          />
          <FormMessage />
          {selectedDate && (
            <p className="text-sm text-gray-500 mt-2">
              Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};