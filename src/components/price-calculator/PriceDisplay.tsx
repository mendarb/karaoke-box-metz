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
    <div className="space-y-4 bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <span className="inline-flex items-center justify-center bg-gray-50 rounded-full px-3 py-1 text-sm">
              {groupSize} {parseInt(groupSize) > 1 ? "personnes" : "personne"}
            </span>
            <span className="inline-flex items-center justify-center bg-gray-50 rounded-full px-3 py-1 text-sm">
              {duration}h
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Euro className="h-4 w-4" />
            <p className="text-sm">
              {pricePerPersonPerHour}€ / personne / heure
            </p>
          </div>
        </div>
        <div className="text-right border-t sm:border-t-0 pt-3 sm:pt-0">
          {showDiscount && (
            <>
              <p className="text-sm line-through text-gray-400">{price}€</p>
              <p className="text-sm font-medium text-green-600 animate-fadeIn">{discountText}</p>
            </>
          )}
          <p className={cn(
            "text-2xl font-bold mt-1",
            showDiscount ? "text-green-600" : "text-gray-900"
          )}>
            {finalPrice}€
          </p>
        </div>
      </div>
    </div>
  );
};