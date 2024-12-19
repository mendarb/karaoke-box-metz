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
      console.log('No valid promo code, using original price:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      form.setValue('discountAmount', 0);
      return;
    }

    const { finalPrice: newPrice, discountAmount } = calculateDiscountedPrice(calculatedPrice, promoData);
    
    console.log('Price calculation:', {
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
    console.log('Promo validation result:', { isValid, promoCode });
    setIsPromoValid(isValid);
    setPromoData(promoCode);
    
    if (!isValid) {
      console.log('Invalid promo code, resetting to original price:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      form.setValue('promoCode', '');
      form.setValue('promoCodeId', null);
      form.setValue('discountAmount', 0);
    } else {
      console.log('Valid promo code, updating form values:', promoCode);
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