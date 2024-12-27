import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Euro } from "lucide-react";

interface PricingSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    perHour: number;
    perPerson: number;
  };
}

export const PricingSettings = ({ form, defaultValue }: PricingSettingsProps) => {
  return (
    <div className="space-y-4 bg-card p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Euro className="h-5 w-5 text-violet-500" />
        <h2 className="font-medium">Tarification</h2>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="basePrice.perHour"
          defaultValue={defaultValue?.perHour || 30}
          rules={{
            required: "Ce champ est requis",
            min: { value: 0, message: "Le prix doit être positif" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par heure</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="pl-7"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                </div>
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
          defaultValue={defaultValue?.perPerson || 5}
          rules={{
            required: "Ce champ est requis",
            min: { value: 0, message: "Le prix doit être positif" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par personne</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="pl-7"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                </div>
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