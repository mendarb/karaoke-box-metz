import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const calculateDiscount = (price: number, date?: string, timeSlot?: string) => {
  if (!date || !timeSlot) {
    console.log('⚠️ Date ou créneau manquant:', { date, timeSlot });
    return { finalPrice: price, hasDiscount: false };
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const dayOfWeek = format(parsedDate, 'EEEE', { locale: fr });
  const hour = parseInt(timeSlot.split(':')[0]);

  const isDiscountDay = dayOfWeek === 'mercredi' || dayOfWeek === 'jeudi';
  const isBeforeSixPM = hour < 18;

  console.log('🕒 Vérification réduction:', {
    dayOfWeek,
    hour,
    isDiscountDay,
    isBeforeSixPM,
    originalPrice: price
  });

  if (isDiscountDay && isBeforeSixPM) {
    const discountedPrice = Math.round(price * 0.8);
    console.log('💰 Prix réduit appliqué:', {
      originalPrice: price,
      discountedPrice,
      reduction: '20%'
    });
    return { finalPrice: discountedPrice, hasDiscount: true };
  }

  return { finalPrice: price, hasDiscount: false };
};