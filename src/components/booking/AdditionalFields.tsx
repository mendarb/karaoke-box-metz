import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { PriceCalculator } from "../PriceCalculator";

interface AdditionalFieldsProps {
  form: UseFormReturn<any>;
  calculatedPrice: number;
  groupSize: string;
  duration: string;
}

export const AdditionalFields = ({ form, calculatedPrice, groupSize, duration }: AdditionalFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message ou demande spéciale (facultatif)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Exemple : Anniversaire, besoin d'une table supplémentaire"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="terms"
        rules={{ required: "Vous devez accepter les conditions" }}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} required />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                J'accepte les conditions générales et la politique d'annulation *
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <PriceCalculator 
        groupSize={groupSize}
        duration={duration}
        onPriceCalculated={() => {}}
      />
    </div>
  );
};