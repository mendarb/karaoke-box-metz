import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BookingWindowSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    startDays: number;
    endDays: number;
  };
}

export const BookingWindowSettings = ({ form, defaultValue }: BookingWindowSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fenêtre de réservation</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bookingWindow.startDays"
          defaultValue={defaultValue?.startDays}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai minimum (jours)</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
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
          defaultValue={defaultValue?.endDays}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai maximum (jours)</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
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