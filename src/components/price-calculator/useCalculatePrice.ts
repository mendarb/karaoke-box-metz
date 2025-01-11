import { useState, useCallback } from "react";
import { PriceSettings } from "./types";

interface CalculatePriceProps {
  settings?: { basePrice: PriceSettings };
}

export const useCalculatePrice = ({ settings }: CalculatePriceProps = {}) => {
  const [price, setPrice] = useState<number>(0);
  const [pricePerPersonPerHour, setPricePerPersonPerHour] = useState<number>(0);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);

  const isDiscountedTimeSlot = (timeSlot: string) => {
    const hour = parseInt(timeSlot);
    const isBeforeSixPM = hour < 18;
    console.log('⏰ Vérification créneau horaire:', {
      timeSlot,
      hour,
      isBeforeSixPM
    });
    return isBeforeSixPM;
  };

  const isDiscountedDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    // 3 = Mercredi, 4 = Jeudi
    const isWednesdayOrThursday = day === 3 || day === 4;
    console.log('📅 Vérification jour:', {
      date: dateStr,
      day,
      isWednesdayOrThursday
    });
    return isWednesdayOrThursday;
  };

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

    // Prix par personne pour la première heure
    const basePrice = baseHourRate + (basePersonRate * size);
    
    // Prix total pour la première heure
    let totalPrice = basePrice;
    
    // Prix réduit pour les heures suivantes (-10%)
    if (hours > 1) {
      const additionalHoursPrice = (basePrice * 0.9) * (hours - 1);
      totalPrice += additionalHoursPrice;
    }

    // Vérifier si la réduction de 20% s'applique
    let shouldApplyDiscount = false;
    if (date && timeSlot) {
      const isDiscounted = isDiscountedDay(date) && isDiscountedTimeSlot(timeSlot);
      if (isDiscounted) {
        const originalPrice = totalPrice;
        totalPrice = totalPrice * 0.8; // -20%
        shouldApplyDiscount = true;
        console.log('💰 Réduction de 20% appliquée:', { 
          date, 
          timeSlot, 
          originalPrice,
          finalPrice: totalPrice,
          day: new Date(date).getDay(),
          hour: parseInt(timeSlot)
        });
      } else {
        console.log('❌ Pas de réduction applicable:', {
          date,
          timeSlot,
          isDiscountedDay: date ? isDiscountedDay(date) : false,
          isDiscountedTimeSlot: timeSlot ? isDiscountedTimeSlot(timeSlot) : false
        });
      }
    } else {
      console.log('⚠️ Date ou créneau manquant:', { date, timeSlot });
    }

    // Arrondir à 2 décimales
    const finalPrice = Number(totalPrice.toFixed(2));
    const pricePerPerson = Number((finalPrice / (size * hours)).toFixed(2));

    console.log('💰 Calcul final du prix:', {
      groupSize,
      duration,
      basePrice,
      totalPrice: finalPrice,
      pricePerPerson,
      hasDiscount: shouldApplyDiscount,
      date,
      timeSlot
    });

    setPrice(finalPrice);
    setPricePerPersonPerHour(pricePerPerson);
    setHasDiscount(shouldApplyDiscount);

    return finalPrice;
  }, [settings]);

  return { price, pricePerPersonPerHour, calculatePrice, hasDiscount };
};