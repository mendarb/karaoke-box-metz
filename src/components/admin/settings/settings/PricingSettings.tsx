import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-violet-500" />
            Tarification de base
          </CardTitle>
          <CardDescription>
            Configurez les tarifs horaires et par personne
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <FormLabel>Prix par heure (€)</FormLabel>
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
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  </div>
                </FormControl>
                <FormDescription>
                  Tarif horaire de base pour une session
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
                <FormLabel>Prix par personne (€)</FormLabel>
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
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  </div>
                </FormControl>
                <FormDescription>
                  Supplément par personne ajouté au tarif horaire
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};