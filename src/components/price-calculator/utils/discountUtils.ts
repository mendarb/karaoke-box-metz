import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const calculateDiscount = (price: number, date: string, timeSlot: string) => {
  if (!date || !timeSlot) {
    console.log('⚠️ Date ou créneau manquant:', { date, timeSlot });
    return { finalPrice: price, hasDiscount: false };
  }

  try {
    // Utiliser directement la date fournie sans ajustement
    const parsedDate = new Date(date);
    const dayOfWeek = format(parsedDate, 'EEEE', { locale: fr });
    const hour = parseInt(timeSlot);

    const isDiscountDay = dayOfWeek === 'mercredi' || dayOfWeek === 'jeudi';
    const isBeforeSixPM = hour < 18;

    console.log('🕒 Vérification réduction:', {
      jour: dayOfWeek,
      heure: hour,
      jourEligible: isDiscountDay,
      heureEligible: isBeforeSixPM,
      prixInitial: price,
      dateString: date,
      parsedDate
    });

    if (isDiscountDay && isBeforeSixPM) {
      const discountedPrice = Math.round(price * 0.8);
      console.log('💰 Réduction appliquée:', {
        prixInitial: price,
        prixReduit: discountedPrice,
        reduction: '20%',
        jour: dayOfWeek,
        heure: hour
      });
      return { finalPrice: discountedPrice, hasDiscount: true };
    }

    console.log('💰 Pas de réduction applicable:', {
      jour: dayOfWeek,
      heure: hour,
      isDiscountDay,
      isBeforeSixPM
    });
    return { finalPrice: price, hasDiscount: false };
  } catch (error) {
    console.error('Erreur lors du calcul de la réduction:', error);
    return { finalPrice: price, hasDiscount: false };
  }
};