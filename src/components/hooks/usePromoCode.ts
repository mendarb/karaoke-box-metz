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
      console.log('Resetting price to original:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      return;
    }

    calculateFinalPrice(promoData);
  }, [calculatedPrice, isPromoValid, promoData, form]);

  const calculateFinalPrice = (promoCode: any) => {
    if (!promoCode) {
      console.log('No promo code, using original price:', calculatedPrice);
      setFinalPrice(calculatedPrice);
      form.setValue('finalPrice', calculatedPrice);
      return;
    }

    let newPrice = calculatedPrice;
    let discountAmount = 0;
    
    console.log('Calculating price with promo code:', {
      type: promoCode.type,
      value: promoCode.value,
      originalPrice: calculatedPrice
    });

    if (promoCode.type === 'free') {
      console.log('Applying free promo code');
      newPrice = 0;
      discountAmount = 100;
    } else if (promoCode.type === 'percentage' && promoCode.value) {
      console.log('Applying percentage discount:', promoCode.value);
      discountAmount = promoCode.value;
      newPrice = calculatedPrice * (1 - promoCode.value / 100);
    } else if (promoCode.type === 'fixed_amount' && promoCode.value) {
      console.log('Applying fixed amount discount:', promoCode.value);
      discountAmount = (promoCode.value / calculatedPrice) * 100;
      newPrice = Math.max(0, calculatedPrice - promoCode.value);
    }
    
    console.log('Final price calculation:', {
      originalPrice: calculatedPrice,
      promoType: promoCode.type,
      promoValue: promoCode.value,
      discountAmount,
      newPrice
    });
    
    const roundedPrice = Math.round(newPrice * 100) / 100;
    console.log('Setting final price to:', roundedPrice);
    
    setFinalPrice(roundedPrice);
    form.setValue('finalPrice', roundedPrice);
    form.setValue('discountAmount', discountAmount);
  };

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
      calculateFinalPrice(promoCode);
    }
  };

  return {
    isPromoValid,
    promoData,
    finalPrice,
    handlePromoValidated
  };
};