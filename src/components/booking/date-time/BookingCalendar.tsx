import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { startOfDay, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

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
        <FormItem className="space-y-4">
          <FormLabel className="text-base font-medium flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-600" />
            Date *
          </FormLabel>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
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
              className={cn(
                "rounded-md mx-auto",
                "w-full max-w-[400px]"
              )}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center gap-1",
                caption_label: "text-lg font-medium text-gray-900",
                nav: "flex items-center gap-1",
                nav_button: cn(
                  "h-9 w-9 bg-transparent p-0 text-gray-500 hover:text-gray-900 hover:bg-violet-50 rounded-full transition-colors",
                  "opacity-100 cursor-pointer"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-gray-500 rounded-md w-10 h-10 font-normal text-[0.8rem] flex items-center justify-center",
                row: "flex w-full mt-2",
                cell: cn(
                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-violet-50",
                  "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                ),
                day: cn(
                  "h-10 w-10 p-0 font-normal rounded-full transition-colors cursor-pointer",
                  "hover:bg-violet-100 focus:bg-violet-100 focus:outline-none"
                ),
                day_range_end: "day-range-end",
                day_selected: "bg-violet-600 text-white hover:bg-violet-700 hover:text-white focus:bg-violet-700 focus:text-white rounded-full font-medium",
                day_today: "bg-violet-100 text-violet-900 rounded-full",
                day_outside: "text-gray-400 opacity-50 aria-selected:bg-violet-50/50 aria-selected:text-gray-500 aria-selected:opacity-30",
                day_disabled: "text-gray-400 opacity-50 hover:bg-transparent cursor-not-allowed",
                day_hidden: "invisible",
              }}
            />
          </div>
          {selectedDate && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};