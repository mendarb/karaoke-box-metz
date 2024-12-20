import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { startOfDay, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingCalendarProps {
  form: UseFormReturn<any>;
  disabledDates: Date[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  minDate: Date;
  maxDate: Date;
  isLoading?: boolean;
}

export const BookingCalendar = ({ 
  form, 
  disabledDates, 
  onDateSelect,
  selectedDate,
  minDate,
  maxDate,
  isLoading = false
}: BookingCalendarProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

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
            className="rounded-md border shadow-sm"
            classNames={{
              day_selected: "bg-violet-600 hover:bg-violet-700 focus:bg-violet-700",
              day_today: "bg-violet-100 text-violet-900",
            }}
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