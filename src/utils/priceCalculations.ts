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

  switch (promoCode.type) {
    case 'free':
      finalPrice = 0;
      discountAmount = 100;
      break;
    case 'percentage':
      if (promoCode.value) {
        discountAmount = promoCode.value;
        finalPrice = originalPrice * (1 - promoCode.value / 100);
      }
      break;
    case 'fixed_amount':
      if (promoCode.value) {
        finalPrice = Math.max(0, originalPrice - promoCode.value);
        discountAmount = (promoCode.value / originalPrice) * 100;
      }
      break;
    default:
      break;
  }

  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100
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