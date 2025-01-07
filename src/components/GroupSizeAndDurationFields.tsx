import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours: number;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours,
}: GroupSizeAndDurationFieldsProps) => {
  const { data: settings } = usePriceSettings();
  const { calculatePrice } = useCalculatePrice({ settings });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);
  const [promoCode, setPromoCode] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const { toast } = useToast();

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  const updatePrices = async (size: string, dur: string, promoCodeId?: string, discount?: number) => {
    if (size && dur) {
      const calculatedPrice = calculatePrice(size, dur);
      let finalPrice = calculatedPrice;

      if (discount) {
        finalPrice = calculatedPrice * (1 - discount / 100);
      }

      const pricePerPersonPerHour = finalPrice / (parseInt(size) * parseInt(dur));
      
      setCurrentPrice(finalPrice);
      setPricePerPerson(pricePerPersonPerHour);
      onPriceCalculated(finalPrice);

      form.setValue("calculatedPrice", calculatedPrice);
      form.setValue("finalPrice", finalPrice);
      if (promoCodeId) {
        form.setValue("promoCodeId", promoCodeId);
      }
      
      console.log('💰 Prix calculé:', {
        groupSize: size,
        duration: dur,
        originalPrice: calculatedPrice,
        finalPrice,
        promoCode: promoCodeId,
        pricePerPerson: pricePerPersonPerHour
      });
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Code promo manquant",
        description: "Veuillez entrer un code promo.",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingPromo(true);
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
        toast({
          title: "Code promo invalide",
          description: "Ce code promo n'existe pas ou n'est plus valide.",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      if (data.start_date && new Date(data.start_date) > now) {
        toast({
          title: "Code promo non valide",
          description: "Ce code promo n'est pas encore valide.",
          variant: "destructive",
        });
        return;
      }

      if (data.end_date && new Date(data.end_date) < now) {
        toast({
          title: "Code promo expiré",
          description: "Ce code promo a expiré.",
          variant: "destructive",
        });
        return;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast({
          title: "Code promo épuisé",
          description: "Ce code promo a atteint sa limite d'utilisation.",
          variant: "destructive",
        });
        return;
      }

      // Appliquer la réduction
      await updatePrices(groupSize, duration, data.id, data.value);
      
      toast({
        title: "Code promo appliqué !",
        description: `Le code ${promoCode} a été appliqué avec succès.`,
      });

    } catch (error: any) {
      console.error('Erreur lors de la validation du code promo:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du code promo.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const currentDuration = form.getValues("duration");
    if (currentDuration) {
      updatePrices(value, currentDuration);
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const currentGroupSize = form.getValues("groupSize");
    if (currentGroupSize) {
      updatePrices(currentGroupSize, value);
    }
  };

  useEffect(() => {
    if (groupSize && duration) {
      updatePrices(groupSize, duration);
    }
  }, [groupSize, duration, settings]);

  return (
    <div className="space-y-6">
      <GroupSizeSelector 
        form={form} 
        onGroupSizeChange={handleGroupSizeChange} 
      />
      <DurationSelector 
        form={form} 
        onDurationChange={handleDurationChange}
        availableHours={availableHours}
      />
      {groupSize && duration && currentPrice > 0 && (
        <>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Code promo"
                className="uppercase"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={validatePromoCode}
                disabled={isValidatingPromo}
              >
                {isValidatingPromo ? "Validation..." : "Valider"}
              </Button>
            </div>
          </div>
          <PriceDisplay
            groupSize={groupSize}
            duration={duration}
            price={currentPrice}
            pricePerPersonPerHour={pricePerPerson}
          />
        </>
      )}
    </div>
  );
};