import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { CalendarOff } from "lucide-react";

interface ExcludedDaysSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: number[];
}

export const ExcludedDaysSettings = ({ form, defaultValue }: ExcludedDaysSettingsProps) => {
  return (
    <div className="space-y-4 bg-card p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <CalendarOff className="h-5 w-5 text-violet-500" />
        <h2 className="font-medium">Jours exclus</h2>
      </div>

      <FormField
        control={form.control}
        name="excludedDays"
        defaultValue={defaultValue || []}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sélectionnez les jours à exclure</FormLabel>
            <FormControl>
              <Calendar
                mode="multiple"
                selected={field.value.map((timestamp: number) => new Date(timestamp))}
                onSelect={(dates) => {
                  field.onChange(dates ? dates.map(date => date.getTime()) : []);
                }}
                className="rounded-md border-none"
                locale={fr}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};