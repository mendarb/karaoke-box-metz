import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const timeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Date minimum : 7 janvier 2025
  const minDate = new Date(2025, 0, 7); // Mois commence à 0 pour janvier

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="date"
        rules={{ required: "La date est requise" }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date *</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={(date) => date < minDate}
                initialFocus
                locale={fr}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timeSlot"
        rules={{ required: "L'heure est requise" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heure *</FormLabel>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <FormControl key={slot}>
                  <Button
                    type="button"
                    variant={field.value === slot ? "default" : "outline"}
                    className={`w-full ${
                      field.value === slot
                        ? "bg-violet-600 hover:bg-violet-700"
                        : ""
                    }`}
                    onClick={() => field.onChange(slot)}
                    disabled={!selectedDate}
                  >
                    {slot}
                  </Button>
                </FormControl>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <p className="text-sm text-gray-500 mt-2">
          Date sélectionnée : {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      )}
    </div>
  );
};