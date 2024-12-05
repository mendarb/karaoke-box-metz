import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface AdditionalFieldsProps {
  form: UseFormReturn<any>;
  calculatedPrice: number;
}

export const AdditionalFields = ({ form, calculatedPrice }: AdditionalFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-violet-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-violet-900 mb-2">
          Prix total : {calculatedPrice}€
        </h3>
        <p className="text-sm text-violet-700">
          Ce montant sera débité lors de la confirmation de votre réservation
        </p>
      </div>

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
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} required />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                J'accepte les conditions générales et la politique d'annulation
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};