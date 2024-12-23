export const validatePrice = (finalPrice: number) => {
  const MINIMUM_AMOUNT = 0.50;
  
  if (finalPrice < MINIMUM_AMOUNT) {
    console.error('❌ Prix trop bas pour Stripe:', {
      price: finalPrice,
      minimumRequired: MINIMUM_AMOUNT
    });
    throw new Error(`Le montant minimum pour un paiement est de ${MINIMUM_AMOUNT}€`);
  }

  return Math.round(finalPrice * 100); // Conversion en centimes pour Stripe
};