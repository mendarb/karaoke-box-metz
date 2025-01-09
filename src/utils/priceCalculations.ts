export const calculateDiscountedPrice = (originalPrice: number, promoCode: any): {
  finalPrice: number;
  discountAmount: number;
} => {
  if (!promoCode) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0
    };
  }

  let finalPrice = originalPrice;
  let discountAmount = 0;

  console.log('💰 Calcul du prix avec réduction:', {
    originalPrice,
    promoCode
  });

  switch (promoCode.type) {
    case 'free':
      finalPrice = 0;
      discountAmount = 100;
      break;
    case 'percentage':
      if (promoCode.value) {
        discountAmount = Math.min(100, promoCode.value);
        finalPrice = originalPrice * (1 - discountAmount / 100);
      }
      break;
    case 'fixed_amount':
      if (promoCode.value) {
        discountAmount = Math.min(100, (promoCode.value / originalPrice) * 100);
        finalPrice = Math.max(0, originalPrice - promoCode.value);
      }
      break;
    default:
      break;
  }

  // Arrondir à 2 décimales
  finalPrice = Math.round(finalPrice * 100) / 100;
  discountAmount = Math.round(discountAmount * 100) / 100;

  console.log('💰 Résultat du calcul:', {
    originalPrice,
    finalPrice,
    discountAmount,
    promoType: promoCode.type
  });

  return {
    finalPrice,
    discountAmount
  };
};

export const formatPriceDescription = (
  groupSize: string,
  duration: string,
  promoCode?: string,
  discountAmount?: number
): string => {
  let description = `${groupSize} personnes - ${duration}h`;
  if (promoCode && discountAmount) {
    description += ` (-${Math.round(discountAmount)}% avec ${promoCode})`;
  }
  return description;
};