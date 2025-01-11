import { useState, useCallback } from "react";
import { PriceSettings } from "./types";
import { calculateBasePrice, calculateTotalPrice, formatPrices } from "./utils/priceUtils";
import { calculateDiscount } from "./utils/discountUtils";

interface CalculatePriceProps {
  settings?: { basePrice: PriceSettings };
}

export const useCalculatePrice = ({ settings }: CalculatePriceProps = {}) => {
  const [price, setPrice] = useState<number>(0);
  const [pricePerPersonPerHour, setPricePerPersonPerHour] = useState<number>(0);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);

  const calculatePrice = useCallback((groupSize: string, duration: string, date?: string, timeSlot?: string) => {
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

    // Calcul du prix de base
    const basePrice = calculateBasePrice(size, baseHourRate, basePersonRate);
    
    // Calcul du prix total avec réduction pour heures additionnelles
    let totalPrice = calculateTotalPrice(basePrice, hours);

    // Application de la réduction selon le jour et l'heure
    const { finalPrice: discountedPrice, hasDiscount: timeDiscount } = calculateDiscount(totalPrice, date, timeSlot);
    totalPrice = discountedPrice;

    // Formatage des prix finaux
    const { finalPrice, pricePerPerson } = formatPrices(totalPrice, size, hours);

    console.log('💰 Calcul final du prix:', {
      groupSize,
      duration,
      basePrice,
      totalPrice: finalPrice,
      pricePerPerson,
      hasDiscount: timeDiscount,
      date,
      timeSlot
    });

    setPrice(finalPrice);
    setPricePerPersonPerHour(pricePerPerson);
    setHasDiscount(timeDiscount);

    return finalPrice;
  }, [settings]);

  return { price, pricePerPersonPerHour, calculatePrice, hasDiscount };
};