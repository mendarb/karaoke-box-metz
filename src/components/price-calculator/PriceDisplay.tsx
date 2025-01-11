import { Check, Clock, Percent } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PriceDisplayProps {
  groupSize: string;
  duration: string;
  price: number;
  finalPrice: number;
  pricePerPersonPerHour: number;
  promoCode?: string;
  isPromoValid?: boolean;
  hasTimeDiscount?: boolean;
}

export const PriceDisplay = ({
  groupSize,
  duration,
  price,
  finalPrice,
  pricePerPersonPerHour,
  promoCode,
  isPromoValid,
  hasTimeDiscount
}: PriceDisplayProps) => {
  const hasDiscount = (isPromoValid && finalPrice < price) || hasTimeDiscount;

  return (
    <div className="space-y-4">
      {hasTimeDiscount && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Une réduction de 20% est appliquée les mercredis et jeudis avant 18h
          </AlertDescription>
        </Alert>
      )}
      
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
    </div>
  );
};