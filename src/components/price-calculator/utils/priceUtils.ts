export const calculateBasePrice = (
  size: number,
  baseHourRate: number,
  basePersonRate: number
) => {
  return baseHourRate + (basePersonRate * size);
};

export const calculateTotalPrice = (
  basePrice: number,
  hours: number
) => {
  // Prix total pour la première heure
  let totalPrice = basePrice;
  
  // Prix réduit pour les heures suivantes (-10%)
  if (hours > 1) {
    const additionalHoursPrice = (basePrice * 0.9) * (hours - 1);
    totalPrice += additionalHoursPrice;
  }

  return totalPrice;
};

export const formatPrices = (
  totalPrice: number,
  size: number,
  hours: number
) => {
  return {
    finalPrice: Number(totalPrice.toFixed(2)),
    pricePerPerson: Number((totalPrice / (size * hours)).toFixed(2))
  };
};