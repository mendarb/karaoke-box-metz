interface BookingSummaryProps {
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  isPromoValid: boolean;
  promoCode?: string;
  finalPrice?: number;
}

export const BookingSummary = ({
  groupSize,
  duration,
  calculatedPrice,
  isPromoValid,
  promoCode,
  finalPrice
}: BookingSummaryProps) => {
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  
  return (
    <div className="bg-violet-50 p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
      <div className="text-sm text-violet-700">
        <p>Nombre de personnes : {groupSize}</p>
        <p>Durée : {duration} heure{parseInt(duration) > 1 ? 's' : ''}</p>
        {showDiscount ? (
          <>
            <p className="line-through text-gray-500">Prix initial : {calculatedPrice}€</p>
            <p className="font-semibold text-green-600">Prix final : {finalPrice}€</p>
            <p className="text-green-600 font-medium">Code promo {promoCode} appliqué</p>
          </>
        ) : (
          <p className="font-semibold">Prix total : {calculatedPrice}€</p>
        )}
      </div>
    </div>
  );
};