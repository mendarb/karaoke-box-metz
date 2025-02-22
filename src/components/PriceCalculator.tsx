import { PriceCalculatorProps } from "./price-calculator/types";
import { usePriceSettings } from "./price-calculator/usePriceSettings";
import { useCalculatePrice } from "./price-calculator/useCalculatePrice";
import { PriceDisplay } from "./price-calculator/PriceDisplay";
import { useEffect } from "react";

export const PriceCalculator = ({ 
  groupSize, 
  duration, 
  onPriceCalculated 
}: PriceCalculatorProps) => {
  const { data: settings, isLoading } = usePriceSettings();
  const { price, pricePerPersonPerHour, calculatePrice } = useCalculatePrice({
    settings,
  });

  useEffect(() => {
    if (groupSize && duration && settings) {
      const calculatedPrice = calculatePrice(groupSize, duration);
      if (onPriceCalculated) {
        onPriceCalculated(calculatedPrice);
      }
      console.log('💰 Prix calculé:', {
        groupSize,
        duration,
        calculatedPrice,
        settings
      });
    }
  }, [groupSize, duration, settings, calculatePrice, onPriceCalculated]);

  if (isLoading || !price) {
    console.log('⏳ Chargement des paramètres de prix...');
    return null;
  }

  return (
    <PriceDisplay 
      groupSize={groupSize}
      duration={duration}
      price={price} 
      finalPrice={price}
      pricePerPersonPerHour={pricePerPersonPerHour} 
    />
  );
};