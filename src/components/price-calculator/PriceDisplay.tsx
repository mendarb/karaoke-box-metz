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
    <div className="bg-white rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {groupSize} personnes - {duration}h
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-gray-900">
          {formatPrice(finalPrice)}
        </div>
        {promoCode && isPromoValid && price !== finalPrice && (
          <div className="text-sm line-through text-gray-400">
            {formatPrice(price)}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        soit {formatPrice(pricePerPersonPerHour)}/personne/heure
      </div>
    </div>
  );
};