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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

const timeSlots = [
  { id: "10-12", label: "10h - 12h" },
  { id: "14-16", label: "14h - 16h" },
  { id: "18-20", label: "18h - 20h" },
  { id: "20-22", label: "20h - 22h" },
];

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date de réservation</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                locale={fr}
                className="rounded-md border"
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
            <FormItem>
              <FormLabel>Créneaux disponibles pour le {format(selectedDate, "d MMMM yyyy", { locale: fr })}</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={field.value === slot.id ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      field.value === slot.id && "bg-violet-600 hover:bg-violet-700"
                    )}
                    onClick={() => field.onChange(slot.id)}
                  >
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