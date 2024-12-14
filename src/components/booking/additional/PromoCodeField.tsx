import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PromoCodeFieldProps {
  onPromoValidated: (isValid: boolean) => void;
  form: any;
}

export const PromoCodeField = ({ onPromoValidated, form }: PromoCodeFieldProps) => {
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    onPromoValidated(false);
    form.setValue('promoCode', code);
  };

  const validatePromoCode = () => {
    if (promoCode === 'TEST2024') {
      onPromoValidated(true);
      form.setValue('promoCode', promoCode);
      toast({
        title: "Code promo valide !",
        description: "Le code TEST2024 a été appliqué avec succès.",
      });
    } else {
      onPromoValidated(false);
      toast({
        title: "Code promo invalide",
        description: "Ce code promo n'est pas valide.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <FormItem>
        <FormLabel>Code promo (optionnel)</FormLabel>
        <div className="flex gap-2">
          <FormControl>
            <Input
              type="text"
              value={promoCode}
              onChange={handlePromoCodeChange}
              placeholder="Entrez votre code promo"
            />
          </FormControl>
          <Button 
            type="button" 
            variant="outline"
            onClick={validatePromoCode}
            className="shrink-0"
          >
            Valider
          </Button>
        </div>
      </FormItem>
    </div>
  );
};