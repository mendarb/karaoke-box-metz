import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface BusinessHoursSettingsProps {
  form: UseFormReturn<any>;
  defaultValues?: Record<string, { isOpen: boolean; hours: string }>;
}

export const BusinessHoursSettings = ({ form, defaultValues }: BusinessHoursSettingsProps) => {
  const days = [
    { id: 'monday', label: 'Lundi' },
    { id: 'tuesday', label: 'Mardi' },
    { id: 'wednesday', label: 'Mercredi' },
    { id: 'thursday', label: 'Jeudi' },
    { id: 'friday', label: 'Vendredi' },
    { id: 'saturday', label: 'Samedi' },
    { id: 'sunday', label: 'Dimanche' },
  ];

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div key={day.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="flex-1">
            <FormField
              control={form.control}
              name={`business_hours.${day.id}.isOpen`}
              defaultValue={defaultValues?.[day.id]?.isOpen}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-24">{day.label}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`business_hours.${day.id}.hours`}
            defaultValue={defaultValues?.[day.id]?.hours}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: 14h00 - 22h00"
                    disabled={!form.watch(`business_hours.${day.id}.isOpen`)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};