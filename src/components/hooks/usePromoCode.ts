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
      console.log('💰 Pas de code promo, prix original:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      return;
    }

    const { finalPrice: discountedPrice, discountAmount } = calculateDiscountedPrice(calculatedPrice, promoData);
    
    console.log('💰 Application du code promo:', {
      originalPrice: calculatedPrice,
      promoCode: promoData.code,
      discountAmount,
      finalPrice: discountedPrice
    });

    setFinalPrice(discountedPrice);
    form.setValue('finalPrice', discountedPrice);
    form.setValue('discountAmount', discountAmount);
  }, [calculatedPrice, isPromoValid, promoData, form]);

  const handlePromoValidated = (isValid: boolean, promoCode?: any) => {
    console.log('🎫 Validation du code promo:', { 
      isValid, 
      promoCode,
      originalPrice: calculatedPrice 
    });

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
      console.log('✅ Code promo valide, application de la réduction:', promoCode);
      form.setValue('promoCode', promoCode.code);
      form.setValue('promoCodeId', promoCode.id);
      
      const { finalPrice: discountedPrice, discountAmount } = calculateDiscountedPrice(calculatedPrice, promoCode);
      setFinalPrice(discountedPrice);
      form.setValue('finalPrice', discountedPrice);
      form.setValue('discountAmount', discountAmount);
    }
  };

  return {
    isPromoValid,
    promoData,
    finalPrice,
    handlePromoValidated
  };
};