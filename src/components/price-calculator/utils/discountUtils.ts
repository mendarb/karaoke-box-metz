export const isDiscountedTimeSlot = (timeSlot: string) => {
  const hour = parseInt(timeSlot);
  const isBeforeSixPM = hour < 18;
  console.log('⏰ Vérification créneau horaire:', {
    timeSlot,
    hour,
    isBeforeSixPM
  });
  return isBeforeSixPM;
};

export const isDiscountedDay = (dateStr: string) => {
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

export const calculateDiscount = (
  totalPrice: number,
  date?: string,
  timeSlot?: string
): { finalPrice: number; hasDiscount: boolean } => {
  if (!date || !timeSlot) {
    console.log('⚠️ Date ou créneau manquant:', { date, timeSlot });
    return { finalPrice: totalPrice, hasDiscount: false };
  }

  const isDiscounted = isDiscountedDay(date) && isDiscountedTimeSlot(timeSlot);
  if (isDiscounted) {
    const discountedPrice = Math.round(totalPrice * 0.8 * 100) / 100; // -20% arrondi à 2 décimales
    console.log('💰 Réduction de 20% appliquée:', { 
      date, 
      timeSlot, 
      originalPrice: totalPrice,
      finalPrice: discountedPrice,
      day: new Date(date).getDay(),
      hour: parseInt(timeSlot)
    });
    return { finalPrice: discountedPrice, hasDiscount: true };
  }

  console.log('❌ Pas de réduction applicable:', {
    date,
    timeSlot,
    isDiscountedDay: date ? isDiscountedDay(date) : false,
    isDiscountedTimeSlot: timeSlot ? isDiscountedTimeSlot(timeSlot) : false
  });
  return { finalPrice: totalPrice, hasDiscount: false };
};