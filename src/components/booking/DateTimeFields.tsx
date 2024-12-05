import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isMonday } from "date-fns";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Clock } from "lucide-react";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

const timeSlots = [
  { id: "17", label: "17:00" },
  { id: "18", label: "18:00" },
  { id: "19", label: "19:00" },
  { id: "20", label: "20:00" },
  { id: "21", label: "21:00" },
  { id: "22", label: "22:00" },
];

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="space-y-6 animate-fadeIn">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-lg font-medium mb-2">Date de réservation</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={(date) => {
                  // Disable only Mondays and dates in the past
                  return isMonday(date) || date < new Date();
                }}
                locale={fr}
                className="rounded-xl border border-violet-100 p-4 mx-auto"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem className="animate-fadeIn">
              <FormLabel className="text-lg font-medium">
                Créneaux disponibles pour le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
              </FormLabel>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={field.value === slot.id ? "default" : "outline"}
                    className={cn(
                      "w-full h-14 text-base gap-2",
                      field.value === slot.id 
                        ? "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-100" 
                        : "hover:border-violet-300"
                    )}
                    onClick={() => field.onChange(slot.id)}
                  >
                    <Clock className="w-5 h-5" />
                    {slot.label}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};