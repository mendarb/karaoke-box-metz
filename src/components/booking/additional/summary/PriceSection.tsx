import { Euro } from "lucide-react";

interface PriceSectionProps {
  calculatedPrice: number;
  finalPrice?: number;
  isPromoValid: boolean;
  promoCode?: string;
}

export const PriceSection = ({ calculatedPrice, finalPrice, isPromoValid, promoCode }: PriceSectionProps) => {
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  const discountPercentage = showDiscount && finalPrice 
    ? Math.round(((calculatedPrice - finalPrice) / calculatedPrice) * 100)
    : 0;

  if (showDiscount) {
    return (
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-2">
          <Euro className="h-4 w-4 text-green-500" />
          <div>
            <p className="line-through text-gray-400 text-sm">{calculatedPrice}€</p>
            <p className="font-semibold text-green-600">{finalPrice}€</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-green-600 text-sm font-medium">
            Code promo {promoCode}
          </span>
          <span className="text-green-600 text-xs">
            -{discountPercentage}% de réduction
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
      <div className="flex items-center space-x-2">
        <Euro className="h-4 w-4 text-violet-500" />
        <p className="font-semibold">{calculatedPrice}€</p>
      </div>
    </div>
  );
};