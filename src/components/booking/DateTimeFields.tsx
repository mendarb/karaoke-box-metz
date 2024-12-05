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
import { format, isMonday, addDays } from "date-fns";
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
  const minDate = new Date();
  const maxDate = addDays(new Date(), 90); // Permet de réserver jusqu'à 90 jours à l'avance

  return (
    <div className="space-y-8 animate-fadeIn">
      <FormField
        control={form.control}
        name="date"
        rules={{ required: "La date est requise" }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-lg font-medium mb-4">Date de réservation *</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={(date) => {
                  return isMonday(date) || date < minDate || date > maxDate;
                }}
                locale={fr}
                required
                className="rounded-xl border-0 p-0 w-full [&_.rdp-caption]:mb-4 [&_.rdp-nav]:h-10 [&_.rdp-cell]:h-10 [&_.rdp-button]:h-10 [&_.rdp-button]:w-10 [&_.rdp-button]:rounded-full [&_.rdp-day_button:hover]:bg-violet-50 [&_.rdp-day_button.rdp-day_selected]:bg-violet-600 [&_.rdp-day_button.rdp-day_selected]:text-white [&_.rdp-nav_button]:rounded-full [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:h-10 [&_.rdp-nav_button:hover]:bg-violet-50"
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
          rules={{ required: "L'horaire est requis" }}
          render={({ field }) => (
            <FormItem className="animate-fadeIn">
              <FormLabel className="text-lg font-medium mb-4 block">
                Créneaux disponibles pour le {format(selectedDate, "d MMMM yyyy", { locale: fr })} *
              </FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={field.value === slot.id ? "default" : "outline"}
                    className={cn(
                      "h-14 text-base rounded-2xl border-2 transition-all duration-200",
                      field.value === slot.id 
                        ? "bg-violet-600 hover:bg-violet-700 border-transparent" 
                        : "hover:border-violet-200 hover:bg-violet-50/50"
                    )}
                    onClick={() => field.onChange(slot.id)}
                  >
                    <Clock className={cn(
                      "w-5 h-5 mr-2",
                      field.value === slot.id ? "text-white" : "text-violet-600"
                    )} />
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