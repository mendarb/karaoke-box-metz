import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { calculateDiscountedPrice } from "@/utils/priceCalculations";

export const usePromoCode = (
  calculatedPrice: number,
  form: UseFormReturn<any>
) => {
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState(calculatedPrice);

  useEffect(() => {
    if (!isPromoValid || !promoData) {
      console.log('💰 Prix original utilisé:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      form.setValue('discountAmount', 0);
      return;
    }

    const { finalPrice: newPrice, discountAmount } = calculateDiscountedPrice(calculatedPrice, promoData);
    
    console.log('💰 Calcul du prix:', {
      originalPrice: calculatedPrice,
      promoType: promoData.type,
      promoValue: promoData.value,
      finalPrice: newPrice,
      discountAmount
    });
    
    setFinalPrice(newPrice);
    form.setValue('finalPrice', newPrice);
    form.setValue('discountAmount', discountAmount);
  }, [calculatedPrice, isPromoValid, promoData, form]);

  const handlePromoValidated = (isValid: boolean, promoCode?: any) => {
    console.log('🎫 Résultat de la validation du code promo:', { isValid, promoCode });
    setIsPromoValid(isValid);
    setPromoData(promoCode);
    
    if (!isValid) {
      console.log('❌ Code promo invalide, retour au prix original:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      form.setValue('promoCode', '');
      form.setValue('promoCodeId', null);
      form.setValue('discountAmount', 0);
    } else {
      console.log('✅ Code promo valide, mise à jour des valeurs:', promoCode);
      form.setValue('promoCode', promoCode.code);
      form.setValue('promoCodeId', promoCode.id);
    }
  };

  return {
    isPromoValid,
    promoData,
    finalPrice,
    handlePromoValidated
  };
};