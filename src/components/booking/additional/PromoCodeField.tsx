import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PromoCodeFieldProps {
  onPromoValidated: (isValid: boolean, promoData?: any) => void;
  form: UseFormReturn<any>;
}

export const PromoCodeField = ({ onPromoValidated, form }: PromoCodeFieldProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setPromoCode(code);
    if (!code) {
      onPromoValidated(false);
      form.setValue("promoCode", "");
      form.setValue("promoCodeId", null);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode) {
      toast({
        title: "Code promo manquant",
        description: "Veuillez entrer un code promo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("🔍 Vérification du code promo:", promoCode);

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("is_active", true)
        .is("deleted_at", null)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        onPromoValidated(false);
        toast({
          title: "Code invalide",
          description: "Ce code promo n'existe pas",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();

      if (data.start_date && new Date(data.start_date) > now) {
        onPromoValidated(false);
        toast({
          title: "Code non valide",
          description: "Ce code promo n'est pas encore actif",
          variant: "destructive",
        });
        return;
      }

      if (data.end_date && new Date(data.end_date) < now) {
        onPromoValidated(false);
        toast({
          title: "Code expiré",
          description: "Ce code promo a expiré",
          variant: "destructive",
        });
        return;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        onPromoValidated(false);
        toast({
          title: "Code épuisé",
          description: "Ce code promo a atteint sa limite d'utilisation",
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Code promo valide:", data);
      onPromoValidated(true, data);
      form.setValue("promoCode", data.code);
      form.setValue("promoCodeId", data.id);
      
      toast({
        title: "Code promo appliqué",
        description: "Le code promo a été appliqué avec succès",
      });

    } catch (error) {
      console.error("❌ Erreur lors de la validation du code promo:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="promoCode"
        render={() => (
          <FormItem>
            <FormLabel>Code promo</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  value={promoCode}
                  onChange={handlePromoCodeChange}
                  placeholder="Entrez votre code promo"
                  className="uppercase"
                />
              </FormControl>
              <Button
                type="button"
                onClick={validatePromoCode}
                disabled={isLoading || !promoCode}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isLoading ? "Vérification..." : "Appliquer"}
              </Button>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};