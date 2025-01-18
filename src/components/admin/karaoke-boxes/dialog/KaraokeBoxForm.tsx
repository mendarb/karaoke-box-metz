import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusSelect } from "./StatusSelect";

interface KaraokeBoxFormProps {
  form: UseFormReturn<any>;
}

export const KaraokeBoxForm = ({ form }: KaraokeBoxFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacité (personnes)</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="1" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="base_price_per_hour"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix de base par heure (€)</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" step="0.01" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StatusSelect form={form} />
    </div>
  );
};