import { formatPrice } from "@/utils/priceCalculations";

interface PriceDisplayProps {
  groupSize: string;
  duration: string;
  price: number;
  finalPrice: number;
  pricePerPersonPerHour: number;
  promoCode?: string;
  isPromoValid?: boolean;
}

export const PriceDisplay = ({
  groupSize,
  duration,
  price,
  finalPrice,
  pricePerPersonPerHour,
  promoCode,
  isPromoValid
}: PriceDisplayProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Résumé</h3>
      <div className="text-sm text-gray-600">
        {groupSize} personnes - {duration}h
      </div>
      
      <div className="space-y-1">
        {promoCode && isPromoValid && (
          <>
            <div className="text-lg font-semibold line-through text-gray-400">
              {formatPrice(price)}
            </div>
            <div className="text-lg font-semibold text-green-600">
              {formatPrice(finalPrice)}
            </div>
          </>
        )}
        {(!promoCode || !isPromoValid) && (
          <div className="text-lg font-semibold">
            {formatPrice(finalPrice)}
          </div>
        )}
        <div className="text-sm text-gray-500">
          {formatPrice(pricePerPersonPerHour)}/personne/heure
        </div>
      </div>
    </div>
  );
};