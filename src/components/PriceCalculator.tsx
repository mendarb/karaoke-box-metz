import { PriceCalculatorProps } from "./price-calculator/types";
import { usePriceSettings } from "./price-calculator/usePriceSettings";
import { useCalculatePrice } from "./price-calculator/useCalculatePrice";
import { PriceDisplay } from "./price-calculator/PriceDisplay";

export const PriceCalculator = ({ 
  groupSize, 
  duration, 
  onPriceCalculated 
}: PriceCalculatorProps) => {
  const { data: settings } = usePriceSettings();
  const { price, pricePerPersonPerHour, calculatePrice } = useCalculatePrice({
    groupSize,
    duration,
    settings,
    onPriceCalculated
  });

  if (!price || !pricePerPersonPerHour) return null;

  return (
    <PriceDisplay 
      price={price} 
      pricePerPersonPerHour={pricePerPersonPerHour} 
    />
  );
};