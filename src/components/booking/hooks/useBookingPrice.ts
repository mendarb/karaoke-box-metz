import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";

export const useBookingPrice = (
  form: UseFormReturn<any>,
  onPriceCalculated: (price: number) => void
) => {
  const { data: settings } = usePriceSettings();
  const { calculatePrice, hasDiscount } = useCalculatePrice({ settings });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);

  const updatePrices = useCallback((size: string, dur: string, date?: string, timeSlot?: string) => {
    if (size && dur) {
      console.log('💰 Calcul du prix avec paramètres:', {
        size,
        dur,
        date,
        timeSlot,
        hasSettings: !!settings
      });

      const calculatedPrice = calculatePrice(size, dur, date, timeSlot);
      const pricePerPersonPerHour = Math.round((calculatedPrice / (parseInt(size) * parseInt(dur))) * 100) / 100;
      
      console.log('💰 Prix calculé:', {
        calculatedPrice,
        pricePerPersonPerHour,
        hasDiscount,
        date,
        timeSlot,
        isDiscountApplied: hasDiscount
      });
      
      setCurrentPrice(calculatedPrice);
      setPricePerPerson(pricePerPersonPerHour);
      onPriceCalculated(calculatedPrice);
      
      form.setValue("calculatedPrice", calculatedPrice);
      form.setValue("finalPrice", calculatedPrice);
    }
  }, [settings, calculatePrice, hasDiscount, form, onPriceCalculated]);

  return {
    currentPrice,
    pricePerPerson,
    hasDiscount,
    updatePrices
  };
};