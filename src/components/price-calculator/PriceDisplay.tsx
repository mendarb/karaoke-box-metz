import { Euro } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const showDiscount = (isPromoValid && finalPrice !== price) || hasTimeDiscount;
  const discountText = hasTimeDiscount ? "Réduction -20% (avant 18h)" : "Code promo appliqué";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            {groupSize} {parseInt(groupSize) > 1 ? "personnes" : "personne"} • {duration}h
          </p>
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4" />
            <p className="text-sm text-gray-500">
              {pricePerPersonPerHour}€ / personne / heure
            </p>
          </div>
        </div>
        <div className="text-right">
          {showDiscount && (
            <>
              <p className="text-sm line-through text-gray-500">{price}€</p>
              <p className="text-sm font-medium text-green-600">{discountText}</p>
            </>
          )}
          <p className={cn(
            "text-2xl font-bold",
            showDiscount ? "text-green-600" : "text-gray-900"
          )}>
            {finalPrice}€
          </p>
        </div>
      </div>
    </div>
  );
};