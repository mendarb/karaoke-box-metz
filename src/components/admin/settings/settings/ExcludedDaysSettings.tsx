import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface ExcludedDaysSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: number[];
}

export const ExcludedDaysSettings = ({ form, defaultValue }: ExcludedDaysSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Jours exclus</h3>
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
                className="rounded-md border"
                locale={fr}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};