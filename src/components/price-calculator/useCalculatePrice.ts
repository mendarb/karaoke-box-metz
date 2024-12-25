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
    if (!settings?.basePrice) {
      console.log('❌ Paramètres de prix manquants');
      return 0;
    }

    const hours = parseFloat(duration);
    const size = parseFloat(groupSize);

    if (isNaN(hours) || isNaN(size) || hours <= 0 || size <= 0) {
      console.log('❌ Valeurs invalides:', { hours, size });
      return 0;
    }

    const baseHourRate = settings.basePrice.perHour || 30;
    const basePersonRate = settings.basePrice.perPerson || 5;

    console.log('💰 Tarifs de base:', { baseHourRate, basePersonRate });

    // Prix par personne pour la première heure
    const basePrice = baseHourRate + (basePersonRate * size);
    
    // Prix total pour la première heure
    let totalPrice = basePrice;
    
    // Prix réduit pour les heures suivantes (-10%)
    if (hours > 1) {
      const additionalHoursPrice = (basePrice * 0.9) * (hours - 1);
      totalPrice += additionalHoursPrice;
    }

    const finalPrice = Math.round(totalPrice * 100) / 100;
    const pricePerPerson = Math.round((finalPrice / (size * hours)) * 100) / 100;

    console.log('💰 Calcul du prix:', {
      groupSize,
      duration,
      basePrice,
      totalPrice: finalPrice,
      pricePerPerson
    });

    return finalPrice;
  };

  useEffect(() => {
    if (groupSize && duration && settings) {
      const calculatedPrice = calculatePrice(groupSize, duration);
      setPrice(calculatedPrice);
      setPricePerPersonPerHour(calculatedPrice / (parseInt(groupSize) * parseInt(duration)));

      if (onPriceCalculated) {
        onPriceCalculated(calculatedPrice);
      }
    }
  }, [groupSize, duration, settings, onPriceCalculated]);

  return { price, pricePerPersonPerHour, calculatePrice };
};