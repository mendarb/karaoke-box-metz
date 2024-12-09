import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface BookingWindowSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    startDays: number;
    endDays: number;
  };
}

export const BookingWindowSettings = ({ form, defaultValue }: BookingWindowSettingsProps) => {
  console.log("BookingWindow default values:", defaultValue);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Fenêtre de réservation</h3>
        <FormField
          control={form.control}
          name="isTestMode"
          defaultValue={false}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-end space-x-2">
              <FormLabel className="!mt-0">Mode Test</FormLabel>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bookingWindow.startDays"
          defaultValue={defaultValue?.startDays || 0}
          rules={{
            required: "Ce champ est requis",
            min: { value: 0, message: "Le délai minimum doit être positif" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai minimum (jours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </FormControl>
              <FormDescription>
                Nombre de jours minimum avant une réservation
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bookingWindow.endDays"
          defaultValue={defaultValue?.endDays || 30}
          rules={{
            required: "Ce champ est requis",
            min: { value: 1, message: "Le délai maximum doit être d'au moins 1 jour" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai maximum (jours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </FormControl>
              <FormDescription>
                Nombre de jours maximum pour réserver à l'avance
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};