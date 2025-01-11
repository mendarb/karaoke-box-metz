import { useState, useEffect } from "react";
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

  const updatePrices = (size: string, dur: string, date?: string, timeSlot?: string) => {
    if (size && dur) {
      console.log('💰 Calcul du prix avec paramètres:', {
        size,
        dur,
        date,
        timeSlot,
        hasSettings: !!settings
      });

      if (!date || !timeSlot) {
        console.log('⚠️ Date ou créneau manquant, pas de réduction possible');
      }

      const calculatedPrice = calculatePrice(size, dur, date, timeSlot);
      const pricePerPersonPerHour = calculatedPrice / (parseInt(size) * parseInt(dur));
      
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
    }
  };

  return {
    currentPrice,
    pricePerPerson,
    hasDiscount,
    updatePrices
  };
};