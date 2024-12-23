import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface LegalPagesSettingsProps {
  form: UseFormReturn<any>;
  defaultValues?: {
    terms: string;
    privacy: string;
    cancellation: string;
  };
}

export const LegalPagesSettings = ({ form, defaultValues }: LegalPagesSettingsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="legal_pages.terms"
        defaultValue={defaultValues?.terms}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conditions Générales de Vente</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[200px]"
                placeholder="Entrez le contenu des CGV..."
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="legal_pages.privacy"
        defaultValue={defaultValues?.privacy}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Politique de confidentialité</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[200px]"
                placeholder="Entrez le contenu de la politique de confidentialité..."
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="legal_pages.cancellation"
        defaultValue={defaultValues?.cancellation}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Politique d'annulation</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[200px]"
                placeholder="Entrez le contenu de la politique d'annulation..."
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};