import { useEffect, useState } from "react";
import { PriceSettings } from "./types";

interface CalculatePriceProps {
  groupSize?: string;
  duration?: string;
  settings?: { basePrice: PriceSettings };
  onPriceCalculated?: (price: number) => void;
}

export const useCalculatePrice = ({ 
  groupSize, 
  duration, 
  settings, 
  onPriceCalculated 
}: CalculatePriceProps = {}) => {
  const [price, setPrice] = useState(0);
  const [pricePerPersonPerHour, setPricePerPersonPerHour] = useState(0);

  const calculatePrice = (groupSize: string, duration: string) => {
    if (!settings) {
      console.log('Missing settings for price calculation');
      return 0;
    }

    const hours = parseFloat(duration);
    const size = parseFloat(groupSize);

    if (isNaN(hours) || isNaN(size) || hours <= 0 || size <= 0) {
      console.log('Invalid input values:', { hours, size });
      return 0;
    }

    const baseHourRate = settings.basePrice?.perHour || 30;
    const basePersonRate = settings.basePrice?.perPerson || 5;

    console.log('Base rates:', { baseHourRate, basePersonRate });

    // Calcul du prix de base par personne et par heure (première heure)
    const basePerPersonHourRate = baseHourRate / size + basePersonRate;
    
    // Calcul du prix réduit par personne et par heure (heures suivantes)
    const discountedPerPersonHourRate = basePerPersonHourRate * 0.9;

    // Calcul du prix total
    const firstHourPrice = basePerPersonHourRate * size;
    let finalPrice = firstHourPrice;

    if (hours > 1) {
      const additionalHoursPrice = discountedPerPersonHourRate * size * (hours - 1);
      finalPrice += additionalHoursPrice;

      console.log('Price calculation:', {
        firstHourPrice,
        additionalHoursPrice,
        finalPrice
      });
    }

    // Arrondir le prix à 2 décimales
    return Math.round(finalPrice * 100) / 100;
  };

  useEffect(() => {
    if (groupSize && duration) {
      const calculatedPrice = calculatePrice(groupSize, duration);
      setPrice(calculatedPrice);

      // Calcul du prix moyen par personne et par heure
      const hours = parseFloat(duration);
      const size = parseFloat(groupSize);
      if (!isNaN(hours) && !isNaN(size) && hours > 0 && size > 0) {
        const averagePerPersonHourRate = calculatedPrice / (hours * size);
        setPricePerPersonPerHour(Math.round(averagePerPersonHourRate * 100) / 100);
      }

      if (onPriceCalculated) {
        onPriceCalculated(calculatedPrice);
      }
    }
  }, [groupSize, duration, settings, onPriceCalculated]);

  return { price, pricePerPersonPerHour, calculatePrice };
};