import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { startOfDay, isEqual, isBefore, format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingCalendarProps {
  form: UseFormReturn<any>;
  disabledDates: Date[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const BookingCalendar = ({ 
  form, 
  disabledDates, 
  onDateSelect,
  selectedDate 
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
              const today = startOfDay(new Date());
              
              // Double vérification pour les dates passées
              if (isBefore(normalizedDate, today)) {
                console.log('Date is in the past, not allowing selection');
                return;
              }
              
              field.onChange(normalizedDate);
              onDateSelect(normalizedDate);
            }}
            disabled={(date) => {
              const normalizedDate = startOfDay(date);
              const today = startOfDay(new Date());
              
              // Vérification explicite pour les dates passées
              if (isBefore(normalizedDate, today)) {
                return true;
              }
              
              return disabledDates.some(disabledDate => 
                isEqual(startOfDay(disabledDate), normalizedDate)
              );
            }}
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