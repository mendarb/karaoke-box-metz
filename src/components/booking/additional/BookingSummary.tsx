import { cn } from "@/lib/utils";

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
  return (
    <div className="bg-violet-50 p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
      <div className="text-sm text-violet-700">
        <p>Nombre de personnes : {groupSize}</p>
        <p>Durée : {duration} heure{parseInt(duration) > 1 ? 's' : ''}</p>
        <p className={cn(
          "font-semibold",
          isPromoValid && "line-through text-gray-500"
        )}>
          Prix total : {calculatedPrice}€
        </p>
        {isPromoValid && promoCode && (
          <>
            <p className="font-semibold text-green-600">Prix final : {finalPrice}€</p>
            <p className="text-green-600 font-medium">Code promo {promoCode} appliqué</p>
          </>
        )}
      </div>
    </div>
  );
};