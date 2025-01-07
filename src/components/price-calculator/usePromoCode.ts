import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const usePromoCode = (
  calculatedPrice: number,
  form: UseFormReturn<any>
) => {
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState(calculatedPrice);

  useEffect(() => {
    if (!isPromoValid || !promoData) {
      console.log('Prix original:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      form.setValue('promoCode', '');
      form.setValue('promoCodeId', null);
      form.setValue('discountAmount', 0);
      return;
    }

    let newPrice = calculatedPrice;
    let discountAmount = 0;
    
    console.log('Application du code promo:', {
      type: promoData.type,
      value: promoData.value,
      originalPrice: calculatedPrice
    });

    if (promoData.type === 'free') {
      newPrice = 0;
      discountAmount = 100;
    } else if (promoData.type === 'percentage' && promoData.value) {
      discountAmount = Math.min(100, promoData.value);
      newPrice = calculatedPrice * (1 - discountAmount / 100);
    } else if (promoData.type === 'fixed_amount' && promoData.value) {
      discountAmount = Math.min(calculatedPrice, promoData.value);
      newPrice = Math.max(0, calculatedPrice - discountAmount);
    }
    
    const roundedPrice = Math.round(newPrice * 100) / 100;
    console.log('Prix final après réduction:', {
      originalPrice: calculatedPrice,
      finalPrice: roundedPrice,
      discountAmount,
      promoType: promoData.type
    });
    
    setFinalPrice(roundedPrice);
    form.setValue('finalPrice', roundedPrice);
    form.setValue('promoCode', promoData.code);
    form.setValue('promoCodeId', promoData.id);
    form.setValue('discountAmount', discountAmount);
  }, [calculatedPrice, isPromoValid, promoData, form]);

  const handlePromoValidated = (isValid: boolean, promoCode?: any) => {
    console.log('Résultat validation code promo:', { isValid, promoCode });
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