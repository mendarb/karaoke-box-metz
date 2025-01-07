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
      form.setValue('discountAmount', 0);
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
    form.setValue('promoCode', promoData.code);
    form.setValue('promoCodeId', promoData.id);
  }, [calculatedPrice, isPromoValid, promoData, form]);

  const handlePromoValidated = (isValid: boolean, promoCode?: any) => {
    console.log('🎫 Validation du code promo:', { 
      isValid, 
      promoCode,
      originalPrice: calculatedPrice 
    });

    setIsPromoValid(isValid);
    setPromoData(promoCode);
  };

  return {
    isPromoValid,
    promoData,
    finalPrice,
    handlePromoValidated
  };
};