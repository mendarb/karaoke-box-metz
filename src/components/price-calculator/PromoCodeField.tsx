import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PromoCodeFieldProps {
  onPromoValidated: (isValid: boolean, promoData?: any) => void;
  isDisabled?: boolean;
}

export const PromoCodeField = ({ onPromoValidated, isDisabled }: PromoCodeFieldProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Code promo manquant",
        description: "Veuillez entrer un code promo.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.trim())
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        onPromoValidated(false);
        toast({
          title: "Code promo invalide",
          description: "Ce code promo n'existe pas ou n'est plus valide.",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      if (data.start_date && new Date(data.start_date) > now) {
        onPromoValidated(false);
        toast({
          title: "Code promo non valide",
          description: "Ce code promo n'est pas encore valide.",
          variant: "destructive",
        });
        return;
      }

      if (data.end_date && new Date(data.end_date) < now) {
        onPromoValidated(false);
        toast({
          title: "Code promo expiré",
          description: "Ce code promo a expiré.",
          variant: "destructive",
        });
        return;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        onPromoValidated(false);
        toast({
          title: "Code promo épuisé",
          description: "Ce code promo a atteint sa limite d'utilisation.",
          variant: "destructive",
        });
        return;
      }

      onPromoValidated(true, data);
      toast({
        title: "Code promo valide !",
        description: `Le code ${promoCode} a été appliqué avec succès.`,
      });

    } catch (error: any) {
      console.error('Erreur lors de la validation du code promo:', error);
      onPromoValidated(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du code promo.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Code promo"
          className="uppercase"
          disabled={isDisabled}
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={validatePromoCode}
          disabled={isValidating || isDisabled}
        >
          {isValidating ? "Validation..." : "Valider"}
        </Button>
      </div>
    </div>
  );
};