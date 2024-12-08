import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PricingSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    perHour: number;
    perPerson: number;
  };
}

export const PricingSettings = ({ form, defaultValue }: PricingSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tarification</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="basePrice.perHour"
          defaultValue={defaultValue?.perHour}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par heure (€)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormDescription>
                Tarif horaire de base
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="basePrice.perPerson"
          defaultValue={defaultValue?.perPerson}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par personne (€)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormDescription>
                Supplément par personne
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};