import { Check } from "lucide-react";

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
  const hasDiscount = isPromoValid && finalPrice < price;

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Résumé</h3>
          <p className="text-sm text-gray-500">
            {groupSize} {parseInt(groupSize) > 1 ? "personnes" : "personne"} - {duration}h
          </p>
        </div>
        <div className="text-right">
          {hasDiscount ? (
            <>
              <p className="text-lg font-bold text-green-600">{finalPrice}€</p>
              <p className="text-sm text-gray-500 line-through">{price}€</p>
            </>
          ) : (
            <p className="text-lg font-bold">{price}€</p>
          )}
          <p className="text-xs text-gray-500">
            {pricePerPersonPerHour.toFixed(2)}€/personne/heure
          </p>
        </div>
      </div>

      {promoCode && (
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm">
            Code promo : <span className="font-mono uppercase">{promoCode}</span>
          </span>
          {isPromoValid && (
            <span className="text-green-600 flex items-center text-sm">
              <Check className="w-4 h-4 mr-1" />
              Appliqué
            </span>
          )}
        </div>
      )}
    </div>
  );
};