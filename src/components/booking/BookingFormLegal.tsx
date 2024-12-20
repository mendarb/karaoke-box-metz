import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { TermsDialog } from "../legal/TermsDialog";
import { PrivacyDialog } from "../legal/PrivacyDialog";
import { CancellationDialog } from "../legal/CancellationDialog";

interface BookingFormLegalProps {
  form: UseFormReturn<any>;
}

export const BookingFormLegal = ({ form }: BookingFormLegalProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="acceptTerms"
        rules={{ required: "Vous devez accepter les conditions générales" }}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <p className="text-sm text-gray-500">
                J'accepte les <TermsDialog onAccept={() => field.onChange(true)} />, la{" "}
                <PrivacyDialog /> et la{" "}
                <CancellationDialog />. En cochant cette case, je consens au traitement de mes données personnelles conformément à la politique de confidentialité.
              </p>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <div className="text-xs text-gray-500 space-y-2">
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, et de portabilité des données vous concernant.
        </p>
        <p>
          Vos données sont utilisées uniquement dans le cadre de votre réservation et ne sont pas transmises à des tiers.
        </p>
      </div>
    </div>
  );
};